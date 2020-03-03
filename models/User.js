const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: [true, "can't be blank"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    password: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    avatar: {
      type: String
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    wish_list: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    purchased: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

// called when logged in user is requesting another user's profile
UserSchema.methods.toProfileJSONFor = function(user) {
  return {
    name: this.name,
    username: this.username,
    bio: this.bio,
    avatar: this.avatar,
    date: this.date,
    following: user ? user.isFollowing(this._id) : false,
    wish_list: this.wish_list
  };
};

// called when logged in user is requesting their own profile
UserSchema.methods.toAuthJSON = function() {
  return {
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    date: this.date,
    username: this.username,
    bio: this.bio,
    following: this.following,
    wish_list: this.wish_list,
    purchased: this.purchased,
    status: "my profile"
  };
};

UserSchema.methods.follow = function(id) {
  if (typeof this.following === "undefined") this.following = [id];
  if (this.following.indexOf(id) === -1) {
    this.following.push(id);
  }
  return this.save;
};

UserSchema.methods.unfollow = function(id) {
  this.following.remove(id);

  return this.save();
};

UserSchema.methods.isFollowing = function(id) {
  return this.following.filter(
    followId => followId.toString() === id.toString()
  );
};

UserSchema.methods.addToWishList = function(id) {
  if (typeof this.wish_list === "undefined") this.wish_list = [id];
  if (this.wish_list.indexOf(id) === -1) {
    this.wish_list.push(id);
  }
  return this.save;
};

UserSchema.methods.removeFromWishList = function(id) {
  this.wish_list.remove(id);

  return this.save();
};

UserSchema.methods.isWish = function(id) {
  return this.wish_list.filter(
    followId => followId.toString() === id.toString()
  );
};

UserSchema.methods.purchase = function(id) {
  if (typeof this.purchased === "undefined") this.purchased = [id];
  if (this.purchased.indexOf(id) === -1) {
    this.purchased.push(id);
  }
  return this.save;
};

UserSchema.methods.isPurchased = function(id) {
  return this.purchased.filter(
    followId => followId.toString() === id.toString()
  );
};

module.exports = User = mongoose.model("User", UserSchema);
