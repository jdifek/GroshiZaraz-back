const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.get('/profile', authMiddleware, authController.profile);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;