const { Schema, model } = require("mongoose");
const friendSchema = require("./Friend");
const thoughtSchema = require("./Thought");
const likeSchema = require("./Like");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            max_length: 32
        },
        email: {
            type: String,
            required: true,
            min_length: 6,
            max_length: 64
        },
        password: {
            type: String,
            required: true,
            min_length: 8,
            max_length: 64
        },
        friends: [friendSchema],
        thoughts: [thoughtSchema],
        likes: [likeSchema],
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

const User = model("user", userSchema);

module.exports = User;