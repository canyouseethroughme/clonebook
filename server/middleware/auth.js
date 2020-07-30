const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  const error = new Error("Unauthorized");
  error.status = 401;

  const token = req.headers.authorization;
  if (!token || !token.length) {
    return next(error);
  }

  const data = jwt.verify(
    token.replace("Bearer ", ""),
    "averysecretkeythatisveryhardtofind"
  );
  if (!data) {
    return next(error);
  }

  User.findOne({ token }, (err, result) => {
    if (err) {
      return next(error);
    }
    if (result === null) {
      return next(error);
    }
    req.userId = result._id;
    req.firstName = result.first_name;
    req.lastName = result.last_name;
    req.photo = result.photo;
    next();
  });
};

module.exports = { isAuthenticated };
