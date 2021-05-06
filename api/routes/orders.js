const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders');

router.post('/checkout', OrdersController.checkout);

module.exports = router;
