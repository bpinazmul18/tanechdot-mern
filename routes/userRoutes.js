const app =  require("express");
const router = app.Router();
const {
    register, 
    registerValiation, 
    login,
    loginValiation,
} = require('../controllers/userController');
router.post("/register", registerValiation, register);

// live api
router.post('/login', loginValiation,login)

module.exports = router;

