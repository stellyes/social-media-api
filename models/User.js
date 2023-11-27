const { Schema, model } = require("mongoose");
const friendSchema = require("./Friend");
const thoughtSchema = require("./Thought");
const likeSchema = require("./Like");

const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
            maxlength: 64
        },
        first: {
            type: String,
            required: true,
            maxlength: 31
        },
        last: {
            type: String,
            required: true,
            maxlength: 32
        },
        email: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 64
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 64
        },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            }
        ],
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Like'
            }
        ],
    }
);

const User = model("user", userSchema);

module.exports = User;