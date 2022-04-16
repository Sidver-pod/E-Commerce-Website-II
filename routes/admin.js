const express = require("express");

const router = express.Router();

const adminController = require('../controllers/admin');

router.post('/add-product', adminController.postAddProduct);
router.get('/view-product', adminController.getViewProduct);
router.put('/update-product', adminController.updateProduct);
router.post('/delete-product', adminController.deleteProduct);

module.exports = router;
