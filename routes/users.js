var express = require('express');
const { signup, signin, signout } = require('../controllers/Users');
const { handleRefreshToken } = require('../controllers/RefreshToken');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/refresh', handleRefreshToken);

module.exports = router;
