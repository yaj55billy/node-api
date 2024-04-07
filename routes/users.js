const express = require('express');
const { isAuth } = require('../service/auth');
const usersController = require('../controllers/users');

const router = express.Router();

router.post('/sign_up', usersController.sign_up);
router.post('/sign_in', usersController.sign_in);

router.get('/profile', isAuth, usersController.profile);
router.patch('/updateProfile', isAuth, usersController.updateProfile);

router.post('/updatePassword', isAuth, usersController.updatePassword);

module.exports = router;






