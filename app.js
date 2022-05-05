const path = require('path');

const bodyParser = require('body-parser');

const express = require('express');

require('dotenv').config();

const adminRoute = require('./routes/admin');
const eCommerceWebsiteRoute = require('./routes/eCommerceWebsite');
const errorController = require('./controllers/error');

const cors = require('cors');

const sequelize = require('./util/database');

// database models
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const User = require('./models/user');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); /* cross-origin-resource-sharing for Axios! */

app.use((req, res, next) => {
    User.findByPk(1)
     .then(user => {
         req.user = user;
         next();
     })
     .catch(err => console.log(err));
});

app.use('/admin', adminRoute);
app.use('/gelato-creameries', eCommerceWebsiteRoute);
app.use(errorController.getError);

/* defining table relations */

// #1
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// #2
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

// #3
Cart.belongsTo(User);
User.hasOne(Cart);

// #4
Order.belongsTo(User);
User.hasMany(Order);

// #5
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// syncs all the models to the database; creates a 'dummy' User if not present; also creates a Cart for the User; then listens on Port No. 3000!
sequelize.sync()
 .then(result => {
    return User.findByPk(1);
 })
 .then(user => {
    if(!user) {
        return User.create( { username: 'Sid', email: 'sid@dummy.com' } );
    }
    else return user;
 })
 .then(user => {
    return user.createCart(); // Cart for 'dummy' User
 })
 .then(cart => {
    console.log('database sync: CHECK');
    app.listen('3000');
 })
 .catch(err => console.log(err));
