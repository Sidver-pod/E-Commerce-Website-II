const express = require('express');

const router = express.Router();

const eCommerceWebsiteController = require('../controllers/eCommerceWebsite');

router.get('/store', eCommerceWebsiteController.getStore);
router.post('/cart/remove', eCommerceWebsiteController.removeCartItem);
router.get('/cart', eCommerceWebsiteController.getCart);
router.post('/cart', eCommerceWebsiteController.postCart);

module.exports = router;
