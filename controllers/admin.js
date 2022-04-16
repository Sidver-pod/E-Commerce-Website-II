const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageURL: imageURL,
    //     description: description,
    //     userId: req.user.id
    // })
    req.user.createProduct({ /* especially for dummy userId -> 1 */
        title: title,
        price: price,
        imageURL: imageURL,
        description: description
    })
     .then(result => {
         res.json({
             "check": "true",
             "newProduct": {"title": title, "price": price, "imageURL": imageURL, "description": description}
         });
     })
     .catch(err => console.log(err));
};

exports.getViewProduct = (req, res, next) => {
    // Product.findAll()
    req.user.getProducts() /* especially for dummy userId -> 1 */
     .then(products => {
         if(products.length === 0) {
             res.json({'check': 'false'});
         }
         else {
             res.json({
                 "check": "true",
                 "products": products
             });
         }
     })
     .catch((err) => console.log(err));
};

exports.updateProduct = (req, res, next) => {
    const prodId = req.body.id;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageURL = req.body.imageURL;
    const updatedDescription = req.body.description;

    Product.findByPk(prodId)
     .then(product => {
         product.title = updatedTitle;
         product.price = updatedPrice;
         product.imageURL = updatedImageURL;
         product.description = updatedDescription;
         product.save();
     })
     .then(result => {
        console.log('product update: CHECK');
        res.json({
            "check": "true"
        });
     })
     .catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.id;
    Product.findByPk(prodId)
     .then(product => {
        product.destroy();
     })
     .then(result => {
        console.log('product destroy: CHECK');
        res.json({
            "check": "true"
        });
     })
     .catch(err => {
         console.log(err);
     });
};
