const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
    {
        thought: {
            type: Schema.Types.ObjectId,
            ref: 'Thought',
            require: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        }
    }
);

const Like = model("like", likeSchema);

module.exports = Like;