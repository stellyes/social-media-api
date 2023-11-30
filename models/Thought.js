const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now(),   
        },
        username: {
            type: String,
            ref: 'User',
            required: true
        },
        reactions: [reactionSchema]
    }
);

const Thought = model("thought", thoughtSchema);

module.exports = Thought;