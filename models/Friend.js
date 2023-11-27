const { Schema, model } = require("mongoose");

const friendSchema = new Schema(
    {
        friender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        friended: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        accepted: {
            type: Boolean,
            required: true,
            default: false
        }
    }
);

const Friend = model("friend", friendSchema);

module.exports = Friend;