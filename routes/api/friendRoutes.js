const router = require('express').Router();
const {
  getFriends,
  getFriend,
  createFriend,
  deleteFriend,
} = require('../../controllers/friendController.js');

router.route('/').get(getFriends).post(createFriend);

router
  .route('/:_id')
  .get(getFriend)
  .delete(deleteFriend);

module.exports = router;