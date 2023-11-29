const { Schema, model } = require("mongoose");

const friendSchema = new Schema(
    {
        friender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        friended: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        accepted: {
            type: Boolean,
            default: false
        }
    }
);

const Friend = model("friend", friendSchema);

module.exports = Friend;