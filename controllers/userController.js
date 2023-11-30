const { Thought, User } = require('../models');

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
              _id: req.params._id
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

        // Delete associated thoughts 
        const thoughts = await Thought.find({ username: user.username });
        thoughts.forEach(thought => {
          Thought.deleteMany({ _id: thought._id })
        })

        res.status(200).json({ message: "User successfully deleted" });
      } catch (err) {
        res.status(500).json(err);
      }
    },
    async addFriend(req, res) {
      try {
        const user = await User.findOne({ _id: req.params.userId });

        if (!user) {
          return res.status(404).json({ message: 'Error: No user/friend with the associated user/friend ID' });
        }

        // Append friendId to friend list and update user 
        user.friends.push(req.params.friendId)
        await User.updateOne({ _id: user._id }, user)

        res.status(200).json(user);
      } catch(err) {
        res.status(500).json(err);
      }
    },
    async removeFriend(req, res) {
      try {
        const user = await User.findOne({ _id: req.params.userId });

        if (!user) {
          return res.status(404).json({ message: 'Error: No user/friend with the associated user/friend ID' });
        }

        user.friends = user.friends.filter(function(friend) {
          // Return everything that's not equal to friendId
          return friend._id.toString() !== req.params.friendId
        })
        await User.updateOne({ _id: user._id }, user)

        res.status(200).json(user);
      } catch(err) {
        res.status(500).json(err);
      }
    }
};