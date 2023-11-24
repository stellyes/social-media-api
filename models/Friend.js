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
        }
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

const Friend = model("friend", friendSchema);

module.exports = Friend;