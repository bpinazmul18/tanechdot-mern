const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');

const {
    updateName,
    updatePassword,
    updatePasswordValidation
} = require('../controllers/profileController');


router.post('/update_name', auth, updateName);
router.post('/update_password', [auth, updatePasswordValidation], updatePassword);

module.exports = router;