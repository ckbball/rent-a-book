const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

const Book = require("../../models/Book");
const Chapter = require("../../models/Chapter");
const User = require("../../models/User");

// Preload book objects on routes with ':book'
router.param("book", async (req, res, next, slug) => {
  let book = await Book.findOne({ slug: slug });
  if (!book) return res.sendStatus(404);

  req.book = book;
  return next();
});

// Preload review objects on routes with ':review'
router.param("review", async (req, res, next, id) => {
  let review = await Review.findById(id);
  if (!review) return res.sendStatus(404);

  req.review = review;
  return next();
});

// @route   POST api/book
// @desc    Create a new book
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.sendStatus(401);
    }

    let book = new Book(req.body.book);

    book.author = user;
    await book.save();
    res.json({ book: book.toJSONFor(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/books/:book
// @desc    Get a book
// @access  Public
router.get("/:book", async (req, res) => {
  try {
    await req.book.populate("author").execPopulate();

    res.json({ book: req.book.toJSONFor(null) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
