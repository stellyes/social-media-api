const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
} = require('../../controllers/userController.js');

router.route('/').get(getUsers).post(createUser);

router
  .route('/:_id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;