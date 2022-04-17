# E-Commerce-Website-II
- Integrated a Backend to the [E-Commerce-Website](https://github.com/Sidver-pod/E-Commerce-Website) (previous repo).
- Created a Backend that deals with sending/retrieving data to-and-fro the MySQL database.
- Backend (localhost) is used to create, read, update and delete products from the SQL database (MySQL).
- Requests are sent from the Frontend using **Axios**. So all requests made are only from the Frontend.
- To allow Cross-Origin Resource Sharing CORS is installed in the server (localhost).
- Consists of functionalities for a single dummy User and an Admin.

    - ### Admin Page
        - Can add new products
        - Can view, edit and delete products
    - ### User Page
        - Can view home-page, store-page & about-page
        - Can "add-to-cart" any product of choice
        - Cart showcases all the products "added-to-cart" and totals the payable bill amount; can also remove items from the Cart

## What's the website about?
It's an 🍦 website wherein the user can add-to-cart from a selection of 🍦🍨 (flavours ranging from 🥭🧀🍰 to 🍫).

## Install the following

- **Nodemon** `npm install --save-dev nodemon`

- **Express** `npm install express --save`

- **Body-Parser** `npm install body-parser --save`

- **MySQL2** `npm install --save mysql2`

- **Sequelize** `npm install --save sequelize`

- **CORS** `npm install cors`
