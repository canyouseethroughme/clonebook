const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { uuid } = require("uuidv4");
const formidable = require("formidable");
const mongoose = require("mongoose");
const detect = require("detect-file-type");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require(__dirname + "/../models/User");
const { isAuthenticated } = require("../middleware/auth");

// ########################################################
// user signup
router.post("/signup", (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (first_name && last_name && email && password) {
    // check password length
    if (password.length < 7) {
      return res.send({
        status: 0,
        response: "Inserted password is too short",
      });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err)
          return res.json({
            status: 0,
            response: `Error trying to signup user: ${err}`,
          });
        // check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.json({ status: 0, response: "User already exists." });
        }
        // sign up user
        try {
          const userId = new mongoose.Types.ObjectId();
          const photoDefault = "https://i.ibb.co/gSbgf9K/male-placeholder.jpg";
          const newUser = {
            _id: userId,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            public_json: {
              user_id: userId,
              first_name,
              last_name,
              photo: photoDefault,
              email,
            },
          };
          const user = await User.create(newUser);
          return res.send({
            status: 1,
            response: `User ${newUser.email} - ${user._id} is created.`,
          });
        } catch (error) {
          return res.json({
            status: 0,
            response: `Error while signing up user ${error}`,
          });
        }
      });
    }
  }
});

// ########################################################
// user login
router.post("/login", async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.send({
        status: 0,
        response: `Something went wrong geting posts ${err}`,
      });
    }
    let email = fields.email;
    let password = fields.password;
    try {
      const user = await User.findOne({ email });
      // check if user exists
      if (!user) {
        return res.json({ status: 0, response: "Incorect credentials" });
      }
      bcrypt.compare(password, user.password, async (err, isSame) => {
        if (err) {
          return res.json({
            status: 0,
            response: `Error while trying to compare password ${err}`,
          });
        } else if (!isSame) {
          return res.json({ status: 0, response: "Incorrect password" });
        } else {
          const token = jwt.sign(
            { userId: user._id, email: email },
            "averysecretkeythatisveryhardtofind"
          );

          User.findOneAndUpdate(
            { email },
            { token: token },
            { useFindAndModify: false },
            (err, result) => {
              if (err) {
                return res.send({ status: 0, response: "Error logging in" });
              }

              return res.send({
                status: 1,
                response: "User logged in",
                token: token,
                user: result,
              });
            }
          );
        }
      });
    } catch (error) {
      return res.json({
        status: 0,
        response: `Error while logging in user ${error}`,
      });
    }
  });
});

// ########################################################
// sign out user
router.put("/signout", isAuthenticated, async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.userId },
    { token: "" },
    { useFindAndModify: false }
  );
  return res.send({
    status: 1,
    response: `User with token ${req.userId} logged out`,
  });
});

// ########################################################
// delete user profile
router.delete("/delete-profile", isAuthenticated, async (req, res) => {
  await User.deleteOne({ _id: req.userId });
  return res.send({
    status: 1,
    response: `User with ID:${req.userId} deleted.`,
  });
});

// ########################################################
// search user profile
router.get("/search", isAuthenticated, async (req, res) => {
  const { search_input } = req.query;

  await User.find(
    {
      $or: [
        { first_name: { $regex: ".*" + search_input + ".*" } },
        { last_name: { $regex: ".*" + search_input + ".*" } },
      ],
    },
    (err, result) => {
      if (err) {
        return res.send({
          status: 0,
          response: `Something went wrong when searching ${err}`,
        });
      }

      return res.send({ status: 1, response: result });
    }
  );
});

// ########################################################
// get user profile
router.get("/profile", isAuthenticated, async (req, res) => {
  const user = await User.findOne({ _id: req.userId });
  return res.send({ status: 1, user });
});

// ########################################################
// update user email
router.put("/update-email", isAuthenticated, async (req, res) => {
  const { email } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: req.userId },
      { email },
      { new: true, useFindAndModify: false },
      (err, updatedEmail) => {
        if (err) {
          return res.send({
            status: 0,
            response: `Cannot update email because ${error}`,
          });
        }

        return res.send({ status: 1, response: updatedEmail });
      }
    );
  } catch (error) {
    return res.send({
      status: 0,
      response: `Cannot update email with error: ${error}`,
    });
  }
});

// ########################################################
// update profile image
router.put("/change-profile-image", isAuthenticated, (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.send({
        status: 0,
        response: "Error processing the image file",
      });
    }
    detect.fromFile(files.picture.path, (err, result) => {
      if (err) {
        return res.send({ status: 0, response: "error detecting" });
      }
      const pictureName = uuid() + "." + result.ext;
      const allowedImageTypes = ["jpg", "jpeg", "png"];

      if (!allowedImageTypes.includes(result.ext)) {
        return res.send({ status: 0, response: "Image format not allowed." });
      }
      const oldPath = files.picture.path;
      const newPath = path.join(__dirname, "..", "pictures", pictureName);

      fs.rename(oldPath, newPath, async (err) => {
        if (err) {
          return res.send({ status: 0, response: "Cannot move image file." });
        }

        try {
          const updatedProfileImage = await User.findOneAndUpdate(
            { _id: req.userId },
            {
              photo: newPath,
              "public_json.photo": newPath,
            },
            { useFindAndModify: false }
          );
          return res.send({
            status: 1,
            response: "Profile picture uploaded successfuly",
            updatedProfileImage,
          });
        } catch (error) {
          return res.json({
            status: 0,
            response: `Error while uploading profile image user ${error}`,
          });
        }
      });
    });
  });
});

// ########################################################
// get all contacts
router.get("/contacts", isAuthenticated, async (req, res) => {
  let users = await User.find();
  let newUsers = users.map((user) => ({ ...user, _id: user._id.toString() }));
  // console.log(typeof users[1]._id.toString());
  return res.send({
    status: 1,
    response: users,
  });
});

module.exports = router;
