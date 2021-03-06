const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/user');

router.post('/signup', UserController.signUp);

router.post('/login', UserController.logIn);

router.get('/:userId', UserController.getOneUser);

router.patch('/:userId', UserController.editUser);

router.delete('/:userId', checkAuth, UserController.deleteUser);

module.exports = router;
