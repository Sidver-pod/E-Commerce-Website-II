const Product = require('../models/product');

const ITEMS_PER_PAGE = 9;
const ITEMS_IN_CART = 3;

exports.getStore = (req, res, next) => {

    const currentPageNumber = req.body.currentPageNumber;
    let totalItems;

    Product.count()
     .then(numOfProducts => {
         totalItems = numOfProducts;

         return Product.findAll({
            offset: (currentPageNumber - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE
        })  
     })
     .then(products => {
         if(totalItems.length === 0) {
             res.json({
                 'check': 'false'
             });
         }
         else {
             res.json({
                 'check': 'true',
                 'totalItems': totalItems,
                 'products': products,
                 'ITEMS_PER_PAGE': ITEMS_PER_PAGE
             });
         }
     })
     .catch(err => {
        console.log(err);
     });
};

exports.getCart = (req, res, next) => {
    const currentCartPageNumber = req.body.currentCartPageNumber;
    let fetchedCart, totalItems, totalAmount = 0;

    req.user.getCart()
     .then(cart => {
         fetchedCart = cart;

         return cart.getProducts();
     })
     .then(products => {
         totalItems = products.length;

         // finding total amount sum (for Front-End!)
         for(let i=0; i<totalItems; i++) {
             let price = products[i].dataValues.price;
             let qty = products[i].dataValues.cartItem.dataValues.quantity;
             totalAmount += price * qty;
         }
         
         return fetchedCart.getProducts({
             offset: (currentCartPageNumber - 1) * ITEMS_IN_CART,
             limit: ITEMS_IN_CART
         });
     })
     .then(products => {
         res.json({
             'totalItems': totalItems,
             'ITEMS_IN_CART': ITEMS_IN_CART,
             'totalAmount': totalAmount,
             'products': products
         });
     })
     .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.prodId;
    const qty = req.body.quantity;
    let totalItems, totalAmount = 0;

    // error check!
    if(!prodId) {
        res.json({
            'check': 'false'
        });
    }

    let fetchedCart;
    
    req.user.getCart()
     .then(cart => {
         fetchedCart = cart;

         return fetchedCart.getProducts({ where: { id: prodId } });
     })
     .then(products => {
         let product;
         
         if(products.length > 0) {
             product = products[0];
         }

         // if product already exists in the Cart
         if(product) return product;
         // if the product is being added to the cart for the first time!
         else return Product.findByPk(prodId);
     })
     .then(product => {
        return fetchedCart.addProduct(product, { through: { quantity: qty } });
     })
     .then(result => {
        return fetchedCart.getProducts();
     })
     .then(products => {
         totalItems = products.length; // will help in determining cart page number buttons

         // finding total amount sum (for Front-End!)
         for(let i=0; i<totalItems; i++) {
             let price = products[i].dataValues.price;
             let qty = products[i].dataValues.cartItem.dataValues.quantity;
             totalAmount += price * qty; // summing to find the pay amount
         }

         res.json({
             'check': 'true',
             'totalItems': totalItems,
             'ITEMS_IN_CART': ITEMS_IN_CART,
             'totalAmount': totalAmount
         });
     })
     .catch(err => console.log(err));
};

exports.removeCartItem = (req, res, next) => {
    const prodId = req.body.prodId;
    let fetchedCart;

    req.user.getCart()
     .then(cart => {
         fetchedCart = cart;
         return cart.getProducts({ where: { id: prodId } });
     })
     .then(products => {
         // product exists in the database!
         if(products.length > 0) {
            let product = products[0];

            return product.cartItem.destroy();
         }
         // product does not exist in the database!!
         else {
             res.json({
                 'check': 'false'
             });
         }
     })
     .then(result => {
        return fetchedCart.getProducts();
     })
     .then(products => {
         let totalItems = products.length; // will help in determining cart page number buttons
         let totalAmount = 0;

         // finding total amount sum (for Front-End!)
         for(let i=0; i<totalItems; i++) {
             let price = products[i].dataValues.price;
             let qty = products[i].dataValues.cartItem.dataValues.quantity;
             totalAmount += price * qty; // summing to find the pay amount
         }

         res.json({
            'check': 'true',
            'totalItems': totalItems,
            'totalAmount': totalAmount,
            'ITEMS_IN_CART': ITEMS_IN_CART
         });
     })
     .catch(err => console.log(err));
};

// specifically for checking if an item is in the Cart
exports.checkCartItem = (req, res, next) => {
    const prodId = req.body.prodId;

    req.user.getCart()
     .then(cart => {
         return cart.getProducts({ where: { id: prodId } });
     })
     .then(products => {
         // item already exists in the Cart!
         if(products.length > 0) {
             res.json({
                 'check': 'true'
             });
         }
         else {
             res.json({
                 'check': 'false'
             });
         }
     })
     .catch(err => console.log(err))
};
