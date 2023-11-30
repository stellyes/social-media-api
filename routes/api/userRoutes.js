const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController.js');

router.route('/').get(getUsers).post(createUser);

router
  .route('/:_id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router
  .route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend)

module.exports = router;