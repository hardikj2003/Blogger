"use strict";

var _require = require("mongoose"),
  Schema = _require.Schema,
  model = _require.model;
var blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  coverImageURL: {
    type: String,
    required: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  likes: {
    type: Number,
    "default": 0
  }
}, {
  timestamps: true
});
blogSchema.index({
  title: "text",
  body: "text"
});
var Blog = model("blog", blogSchema);
module.exports = Blog;