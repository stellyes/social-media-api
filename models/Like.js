const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
    {
        thought: {
            type: Schema.Types.ObjectId,
            ref: 'Thought',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    }
);

const Like = model("like", likeSchema);

module.exports = Like;