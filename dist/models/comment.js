"use strict";

var _require = require("mongoose"),
  Schema = _require.Schema,
  model = _require.model;
var commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  blogId: {
    type: Schema.Types.ObjectId,
    ref: "blog"
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
}, {
  timestamps: true
});
var Comment = model("comment", commentSchema);
module.exports = Comment;