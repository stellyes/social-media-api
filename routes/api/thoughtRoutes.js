const router = require('express').Router();
const {
  getThoughts,
  getThought,
  updateThought,
  createThought,
  deleteThought,
} = require('../../controllers/thoughtController.js');

router.route('/').get(getThoughts).post(createThought);

router
  .route('/:_id')
  .get(getThought)
  .put(updateThought)
  .delete(deleteThought);

module.exports = router;