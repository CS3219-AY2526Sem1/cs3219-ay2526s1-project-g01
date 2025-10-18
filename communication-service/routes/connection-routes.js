const express = require('express');
const router = express.Router();
const ConnectionController = require('../controller/connection-controller');

router.post('/offer', ConnectionController.offerConnection);

router.post('/answer', ConnectionController.answerConnection);

module.exports = router; 