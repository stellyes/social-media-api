const router = require('express').Router();
const {
  getLikes,
  getLike,
  createLike,
  deleteLike,
} = require('../../controllers/likeController.js');

router.route('/').get(getLikes).post(createLike);

router
  .route('/:_id')
  .get(getLike)
  .delete(deleteLike);

module.exports = router;