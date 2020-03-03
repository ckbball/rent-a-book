const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const ChapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    word_count: {
      type: Number
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    },
    content: {
      type: String,
      minLength: 128
    }
  },
  { timestamps: true }
);

ChapterSchema.plugin(uniqueValidator, { message: "is already taken." });

// called when logged in user is requesting another user's profile
ChapterSchema.methods.toProfileJSONFor = function(user) {
  return {
    title: this.title,
    word_count: this.word_count,
    book: this.book,
    content: this.content
  };
};

// called when logged in user is requesting their own profile
ChapterSchema.methods.toAuthJSON = function() {
  return {
    title: this.title,
    word_count: this.word_count,
    book: this.book,
    content: this.content
  };
};

module.exports = Chapter = mongoose.model("Chapter", ChapterSchema);
