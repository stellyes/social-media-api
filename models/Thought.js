const { Schema, model } = require("mongoose");

const thoughtSchema = new Schema(
    {
        post: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Like',
            }
        ],
    }
);

const Thought = model("thought", thoughtSchema);

module.exports = Thought;