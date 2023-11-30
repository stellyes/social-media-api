const { Thought } = require("../models");

module.exports = {
    // Get all thoughts
    async getThoughts (req, res)  {
        try {
            const thoughts = await Thought.find();
            res.status(200).json(thoughts);
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
    // Update existing thought
    async updateThought(req, res) {
        try {
          const thought = await Thought.updateOne({ _id: req.params._id }, { $set: req.body });
  
          if (!thought) {
            return res.status(404).json({ message: "Error: No thought associated with the provided id" });
          }
  
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

        res.status(200).json({ message: 'Thought successfully deleted' });
        } catch (err) {
        res.status(500).json(err);
        }
    },
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })

            if (!thought) {
                return res.status(404).json({ message: 'Error: No thought with the associated thought ID' });
            }
            
            thought.reactions.push(req.body)
            await Thought.updateOne({ _id: req.params.thoughtId }, { $set: { reactions: thought.reactions } });

            res.status(200).json(thought);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'Error: No thought with the associated thought ID' });
            }

            thought.reactions = thought.reactions.filter(function(reaction) {
                // Return everything that's not equal to friendId
                return reaction._id.toString() !== req.body.reactionId
            });
            await Thought.updateOne({ _id: req.params.thoughtId }, { $set: { reactions: thought.reactions } });

            res.status(200).json(thought);
        } catch(err) {
            res.status(500).json(err);
        }
    }
};