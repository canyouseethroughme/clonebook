const router = require("express").Router();
const mongoose = require("mongoose");
const { uuid } = require("uuidv4");
const formidable = require("formidable");
const detect = require("detect-file-type");
const fs = require("fs");
const path = require("path");
const User = require(__dirname + "/../models/User");
const { isAuthenticated } = require("../middleware/auth");

// #########################
// create a post
router.post("/", isAuthenticated, async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.send({
        status: 0,
        response: `Something went wrong geting posts ${err}`,
      });
    }

    detect.fromFile(files.photo.path, (err, result) => {
      if (err) {
        return res.send({ status: 0, response: "error detecting" });
      }

      const pictureName = uuid() + "." + result.ext;

      const oldPath = files.photo.path;
      const newPath = path.join(__dirname, "..", "pictures", pictureName);

      fs.copyFile(oldPath, newPath, async (err) => {
        if (err) {
          return res.send({
            status: 0,
            response: "Something went wrong saving the photo post.",
          });
        }

        let user = await User.findOne({ _id: req.userId });

        user.posts.push({
          _id: new mongoose.Types.ObjectId(),
          description: fields.description,
          photo: pictureName,
          user: {
            _id: new mongoose.Types.ObjectId(req.userId),
            photo: user.photo,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        });
        user.save((err, result) => {
          if (err) {
            return res.send({
              status: 0,
              response: "Something went wrong saving the post data.",
            });
          }
          return res.send({
            status: 1,
            response: result.posts[result.posts.length - 1],
          });
        });
      });
    });
  });
});

// #########################
// get all posts (friends + me)
router.get("/", isAuthenticated, async (req, res) => {
  let users = await User.find();

  let posts = [];

  for (let i = 0; i < users.length; i++) {
    if (users[i].posts.length > 0) {
      posts = [...users[i].posts, ...posts];
    }
  }

  return res.send({
    status: 1,
    response: posts.sort((a, b) => b.timestamp - a.timestamp),
  });
});

// #########################
// like a post
router.post("/likes", isAuthenticated, async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
    }

    post_id = fields.post_id;

    let user = await User.findOne({ "posts._id": post_id });

    for (let i = 0; i < user.posts.length; i++) {
      if (user.posts[i].id === post_id) {
        const likeIndex = user.posts[i].likes.findIndex(
          (x) => x.user_id.toString() === req.userId.toString()
        );

        if (likeIndex >= 0) {
          user.posts[i].likes.splice(likeIndex, 1);
        } else {
          user.posts[i].likes.push({
            user_id: req.userId,
            first_name: req.firstName,
            last_name: req.lastName,
            photo: req.photo,
          });
        }

        await User.findOneAndUpdate(
          { "posts._id": post_id },
          user,
          { new: true, useFindAndModify: false },
          (err, updatePost) => {
            if (err) {
              console.log("Error updating likes", err);
            }
            res.send({ status: 1, response: updatePost });
          }
        );
      }
    }
  });
});

// #########################
// get all likes
router.get("/likes", async (req, res) => {
  const { post_id } = req.query;

  let user = await User.findOne({ "posts._id": post_id });

  return res
    .status(200)
    .send({ response: user.posts.find((item) => item.id === post_id).likes });
});

module.exports = router;
