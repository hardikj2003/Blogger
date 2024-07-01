"use strict";

var _require = require("../services/authentication"),
  validateToken = _require.validateToken;
function checkForAuthenticationCookie(cookieName) {
  return function (req, res, next) {
    var tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }
    try {
      var userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}
module.exports = {
  checkForAuthenticationCookie: checkForAuthenticationCookie
};