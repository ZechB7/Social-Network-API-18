const router = require('express').Router();
const {
  getAllThoughts,
  getThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getAllThoughts);

router.route('/:thoughtId/').post(createThought);

router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

router.route('/:thoughtId/reactions').post(addReaction);

router.route('/:thoughtId/reactions/:reactionsId').delete(removeReaction);

module.exports = router;