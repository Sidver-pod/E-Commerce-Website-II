const express = require('express');

const router = express.Router();

const eCommerceWebsiteController = require('../controllers/eCommerceWebsite');

router.post('/store', eCommerceWebsiteController.getStore);
router.post('/cart/remove', eCommerceWebsiteController.removeCartItem);
router.post('/get-cart', eCommerceWebsiteController.getCart);
router.post('/cart', eCommerceWebsiteController.postCart);
router.post('/check-cart', eCommerceWebsiteController.checkCartItem);

module.exports = router;
