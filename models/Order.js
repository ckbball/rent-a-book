const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    info: {
      type: Number
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

OrderSchema.plugin(uniqueValidator, { message: "is already taken." });

// called when logged in user is requesting another user's profile
OrderSchema.methods.toProfileJSONFor = function(user) {
  return {
    title: this.title,
    word_count: this.word_count,
    book: this.book,
    content: this.content
  };
};

// called when logged in user is requesting their own profile
OrderSchema.methods.toAuthJSON = function() {
  return {
    title: this.title,
    word_count: this.word_count,
    book: this.book,
    content: this.content
  };
};

module.exports = Order = mongoose.model("Order", OrderSchema);
