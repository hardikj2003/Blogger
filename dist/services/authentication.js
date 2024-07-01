"use strict";

var JWT = require("jsonwebtoken");
var secret = "super@123";
function createTokenForUser(user) {
  var payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role
  };
  var token = JWT.sign(payload, secret);
  return token;
}
function validateToken(token) {
  var payload = JWT.verify(token, secret);
  return payload;
}
module.exports = {
  createTokenForUser: createTokenForUser,
  validateToken: validateToken
};