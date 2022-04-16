const Product = require('../models/product');

const Cart = require('../models/cart');

exports.getStore = (req, res, next) => {
    Product.findAll()
     .then(products => {
         if(products.length === 0) {
             res.json({
                 'check': 'false'
             });
         }
         else {
             res.json({
                 'check': 'true',
                 'products': products
             });
         }
     })
     .catch(err => {
        console.log(err);
     });
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
     .then(cart => {
         return cart.getProducts();
     })
     .then(products => {
         res.json(products);
     })
     .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.prodId;
    const qty = req.body.quantity;

    let fetchedCart;
    
    req.user.getCart()
     .then(cart => {
         fetchedCart = cart;
         return cart.getProducts({ where: { id: prodId } });
     })
     .then(products => {
         let product;
         
         if(products.length > 0) {
             product = products[0];
         }

         // if product already exists in the Cart
         if(product) {
             return product;
         }
         // if the product is being added to the cart for the first time!
         else {
            return Product.findByPk(prodId)
         }
     })
     .then(product => {
        fetchedCart.addProduct(product, { through: { quantity: qty } });
        res.json({
            'check': 'true'
        });
    })
    .catch(err => console.log(err));
};

exports.removeCartItem = (req, res, next) => {
    const prodId = req.body.prodId;

    req.user.getCart()
     .then(cart => {
         return cart.getProducts({ where: { id: prodId } });
     })
     .then(products => {
         // product exists in the database!
         if(products.length > 0) {
            let product = products[0];
            product.cartItem.destroy();
            res.json({
                'check': 'true'
            });
         }
         // product does not exist in the database!!
         else {
             res.json({
                 'check': 'false'
             });
         }
     })
     .catch(err => console.log(err));
};
