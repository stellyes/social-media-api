const { Friend, User } = require("../models");

module.exports = {
    // Get all friend associations
    async getFriends(req, res)  {
        try {
            const friends = await Friend.find();
            res.status(200).json(friends);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    // Get specific friend association
    async getFriend(req, res) {
        try {
            const friend = await Friend.find({ 
                _id: req.params._id 
            }).select("-__v");

            if (!friend)  {
                return res.status(404).json({ message: "Error: No friendship with the associated friendship ID"})
            }
    
            res.status(200).json(friend);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    // Create new friend request
    async createFriend(req, res) {
        try {
            // Search for existing friend request, throw error if found
            const inverseSearch = await Friend.findOne({ 
                friender: req.body.friended,
                friended: req.body.friender
            });
            const forwardSearch = await Friend.findOne({ 
                friender: req.body.friender,
                friended: req.body.friended
            });

            if (forwardSearch || inverseSearch) {
                const deleted = await Friend.deleteOne({ _id: friendRequest._id })
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
                res.status(409).json({ message: "Error: friend association already exists" })
            }

            // Create friend request
            const friendRequest = await Friend.create(req.body);
            res.status(200).json(friendRequest);
        } catch(err) {
            return res.status(500).json(err);
        }
    },
    // Delete friend 
    async deleteLike(req, res) {
        try {
        const friend = await Friend.findOneAndDelete({ _id: req.params._id });

        if (!friend) {
            return res.status(404).json({ message: 'Error: No friend with the associated friend ID' });
        }

        // Remove any associated data
        const friender = await User.findOne({ _id: friend.friender });
        let tempFriends = [];
        for (const tempFriend in friender.friends) {
            // If friend assoociation matching the deleted one 
            // found, skip adding to list
            if (friend._id.toString() == tempFriend._id.toString()) {
                continue;
            }
            tempFriends.push(tempFriend);
        }
        // Set friends list to updated list
        friender.friends = tempFriends;
        await User.updateOne({ _id: friender._id }, friender);

        const friended = await User.findOne({ _id: friend.friended });
        tempFriends = [];
        for (const tempFriend in friended.friends) {
            if (friended._id.toString() == tempFriend._id.toString()) {
                continue;
            }
            tempFriends.push(tempFriend);
        }
        friender.friends = tempFriends;
        await User.updateOne({ _id: friender._id }, friender);
       
        res.status(200).json({ message: 'Friend successfully deleted' });
        } catch(err) {
        res.status(500).json(err);
        }
    }
};