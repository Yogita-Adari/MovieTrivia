const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

// user controllers
const { createOrUpdateUser, checkUser, getCurrentUser, createGoogleUser, health } = require('../service/auth');

router.post('/createOrUpdateUser', authCheck, createOrUpdateUser);
router.get('/createGoogleUser', authCheck, createGoogleUser);
router.post('/checkUser', checkUser);
router.post('/getCurrentUser', authCheck, getCurrentUser);
router.get('/health', health);

module.exports = router;