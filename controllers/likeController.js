const { Like, User, Thought } = require("../models");

module.exports = {
    // Get all likes
    async getLikes(req, res)  {
        try {
            const likes = await Like.find();
            res.status(200).json(likes);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    // Get specific like
    async getLike(req, res) {
        try {
            const like = await Like.find({ 
                _id: req.params._id 
            }).select("-__v");

            if (!like)  {
                return res.status(404).json({ message: "Error: No like with the associated like ID"})
            }
  
            res.status(200).json(like);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    // Create new like
    async createLike(req, res) {
        try {
            const like = await Like.create(req.body);
            res.status(200).json(like);
        } catch(err) {
            return res.status(500).json(err);
        }
    },
    // Delete like
    async deleteLike(req, res) {
        try {
        const like = await Like.findOneAndDelete({ _id: req.params._id });

        if (!like) {
            return res.status(404).json({ message: 'Error: No like with the associated like ID' });
        }

        // Remove any associated data
        const tempThought = await Thought.findOne({ _id: { $in: like.thought } });
        const tempUser = await User.findOne({ _id: { $in: like.user } });
        
        let tempLikes = [];
        for (const tempLike of tempThought.likes) {
            // Find like to be deleted, skip adding to tempLikes if match found
            if (tempLike._id.toString() == like._id.toString()) {
                continue;
            } 
            tempLikes.push(tempLike);
        }

        // Add new likeList to thought and update
        tempThought.likes = tempLikes;
        await Thought.updateOne({ _id: like.thought }, tempThought);

        tempLikes = [];
        for (const tempLike of tempUser.likes) {
            if (tempLike._id.toString() == like._id.toString()) {
                continue;
            }
            tempLikes.push(tempLike);
        }

        // Add new likeList to user and update
        tempUser.likes = tempLikes;
        await User.updateOne({ _id: like.user }, tempUser);

        res.status(200).json({ message: 'Like successfully deleted' });
        } catch(err) {
        res.status(500).json(err);
        }
    }
};