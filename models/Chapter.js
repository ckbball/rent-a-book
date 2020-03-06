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
    chapter_number: {
      type: Number
    },
    next_chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter"
    },
    prev_chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter"
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
    content: this.content,
    next_chapter: this.next_chapter,
    prev_chapter: this.prev_chapter,
    chapter_number: this.chapter_number
  };
};

// called when logged in user is requesting their own profile
ChapterSchema.methods.toAuthJSON = function() {
  return {
    title: this.title,
    word_count: this.word_count,
    book: this.book,
    content: this.content,
    next_chapter: this.next_chapter,
    prev_chapter: this.prev_chapter,
    chapter_number: this.chapter_number
  };
};

// methods to be added
// addNextChapter
// addPrevChapter
// updateContent
//

module.exports = Chapter = mongoose.model("Chapter", ChapterSchema);
