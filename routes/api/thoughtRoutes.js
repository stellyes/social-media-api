const router = require('express').Router();
const {
  getThoughts,
  getThought,
  updateThought,
  createThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thoughtController.js');

router.route('/').get(getThoughts).post(createThought);

router
  .route('/:_id')
  .get(getThought)
  .put(updateThought)
  .delete(deleteThought);

router
  .route('/:thoughtId/reactions')
  .post(createReaction)
  .delete(deleteReaction);
  
module.exports = router;