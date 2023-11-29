const { Thought, User, Like } = require("../models");

module.exports = {
    // Get all thoughts
    async getThoughts (req, res)  {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    // Get specific thought
    async getThought (req, res) {
        try {
            const thought = await Thought.find({ 
                _id: req.params._id 
            }).select("-__v");

            if (!thought)  {
                return res.status(404).json({ message: "Error: No thought with the associated thought ID"})
            }
  
            res.status(200).json(thought);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    // Create new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            res.status(200).json(thought);
        } catch(err) {
            return res.status(500).json(err);
        }
    },
    // Delete thought
    async deleteThought(req, res) {
        try {
        const thought = await Thought.findOneAndDelete({ _id: req.params._id });

        if (!thought) {
            return res.status(404).json({ message: 'Error: No thought with the associated thought ID' });
        }

        // Remove any associated likes
        await Like.deleteMany({ thought: { $in: thought._id } });
        for (const like of thought.likes) {
            const tempLike = await Like.findOneAndDelete({ _id: like._id });
            const tempUser = await User.findOne({ _id: tempLike.user });
            let userLikes = [];

            // Remove like from User model associated with like
            for (const userLike of tempUser.likes) {
                // If match found, skip to next iteration of adding to userLikes
                if (userLike._id.toString() == like._id.toString()) {
                    continue;
                } 

                userLikes.push(userLike)
            }

            // Update user with new likeList excluding like on now deleted post
            tempUser.likes = userLikes;
            await User.updateOne({ _id: tempUser._id }, tempUser);
        }
        res.json({ message: 'Thought successfully deleted' });
        } catch (err) {
        res.status(500).json(err);
        }
    }
};