const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 64,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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
                unique: true,
                ref: "User"
            }
        ],
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thought"
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

// Get number of friends in friends list
userSchema
    .virtual("friendCount")
    .get(function() {
        return this.friends.length;
    })

const User = model("user", userSchema);

module.exports = User;