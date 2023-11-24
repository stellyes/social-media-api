const { Schema, model } = require("mongoose");

const thoughtSchema = new Schema(
    {
        post: {
            type: Text,
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
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

const Thought = model("thought", thoughtSchema);

module.exports = Thought;