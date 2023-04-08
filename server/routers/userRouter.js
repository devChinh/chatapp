const router = require('express').Router();
const { register, getUser, login, setAvatar, getAllUsers } = require('../controllers/userController')


router.post('/register', register);
router.post('/login', login);
router.post('/setAvatar/:id', setAvatar);
router.get('/allusers/:id', getAllUsers);
router.get("/getUser", getUser)

module.exports = router;