const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    summary: {
      type: String,
      required: true,
      minLength: 16,
      maxLength: 256
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    price: {
      type: Number,
      required: true
    },
    main_genre: {
      type: String
    },
    sub_genres: [
      {
        type: String,
        maxLength: 128
      }
    ],
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter"
      }
    ],
    date_published: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

BookSchema.plugin(uniqueValidator, { message: "is already taken." });

// called when logged in user is requesting another user's profile
BookSchema.methods.toProfileJSONFor = function(user) {
  return {
    title: this.title,
    summary: this.summary,
    author: this.author,
    price: this.price,
    main_genre: this.main_genre,
    sub_genre: this.sub_genre,
    chapters: this.chapters,
    date_published: this.date_published
  };
};

// called when logged in user is requesting their own profile
BookSchema.methods.toAuthJSON = function() {
  return {
    title: this.title,
    summary: this.summary,
    author: this.author,
    price: this.price,
    main_genre: this.main_genre,
    sub_genre: this.sub_genre,
    chapters: this.chapters,
    date_published: this.date_published
  };
};

module.exports = Book = mongoose.model("Book", BookSchema);
