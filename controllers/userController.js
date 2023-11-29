const { Friend, Like, Thought, User } = require('../models');

module.exports =  {
  // Get ALL users
  async getUsers(req, res) {
      try {
          const users = await User.find();
          res.status(200).json(users);
      } catch(err) {
          res.status(500).json(err);
      }
  },
  // Get specific user by ID
  async getUser(req, res) {
      try {
          const user = await User.findOne({
              _id: req.params.user
          }).select("-__v");

          if (!user)  {
              return res.status(404).json({ message: "Error: No user with the associated user ID"})
          }

          res.status(200).json(user);
      } catch(err) {
          res.status(500).json(err);
      }
  },
  // Create new user
  async createUser(req, res) {
      try {
        const user = await User.create(req.body);
        res.status(200).json(user);
      } catch(err) {
        return res.status(500).json(err);
      }
    },
    // Update existing user
    async updateUser(req, res) {
      try {
        const user = await User.updateOne({ _id: req.params._id }, { $set: req.body });

        if (!user) {
          return res.status(404).json({ message: "Error: No user associated with the provided id" });
        }

        res.status(200).json(user);
      } catch(err) {
        return res.status(500).json(err);
      }
    },
    // Delete user
    async deleteUser(req, res) {
      try {
        const user = await User.findOneAndDelete({ _id: req.params._id });
  
        if (!user) {
          return res.status(404).json({ message: 'Error: No user with the associated user ID' });
        }
  
        // Remove any associated likes 
        await Like.deleteMany({ user: { $in: user._id } });

        // Remove likes on thoughts authored by user
        const likesOnThoughts = await Thought.find({ _id: user._id })
        for (const like of likesOnThoughts) {
          await Like.deleteOne({ _id: like._id });
        }

        // Remove any associated thoughts
        await Thought.deleteMany({ user: { $in: user._id } });

        // Remove any friend associations
        await Friend.deleteMany({ friender: { $in: user._id } });
        await Friend.deleteMany({ friended: { $in: user._id } });

        res.status(200).json({ message: "User successfully deleted" });
      } catch (err) {
        res.status(500).json(err);
      }
    }
};