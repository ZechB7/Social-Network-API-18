const { Thought, User } = require('../models');

module.exports = {
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err.message));
  },

  getOneThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'Id not found' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  createThought(req, res) {
    Thought.create(req.body).then((thought) => {
      return User.findOneAndUpdate(
        { username: req.body.username },
        { $push: { thoughts: thought } },
        { runValidators: true, new: true }
      )
        .then((user) => {
          !user
            ? res.status(404).json({ message: 'Username not found' })
            : res.json({ username: user.username, thoughts: user.thoughts[0] });

        })

    })
      .catch((err) => {
        return res.status(500).json(err.message);
      });
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true })
      )
      .then(() => res.json({ message: 'Deleted' }))
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .then(reaction => {
        if (!reaction) {
          return res.status(404).json({ message: 'Id not found' });
        };
        res.json(reaction);
      })
      .catch(err => res.status(500).json(err.message));
  },

  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'Id not found' });
          return;
        };
        res.json(thought);
      })
      .catch(err => res.status(500).json(err.message));
  }
};