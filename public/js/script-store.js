document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();

    /* 
        #1 hiding all 'li' elements (products) on the Front-End first!
        #2 adding 'click' event to product image to show description on Pop-Up
    */

    // Pop-Up
    let divPopUpContainer = document.getElementById('container');
    // close button on Pop-Up
    let buttonClose = document.getElementById('close');
    buttonClose.addEventListener('click', (e) => {
        divPopUpContainer.classList.remove('active-popup');
        divPopUpContainer.children[0].children[1].remove();
    });

    let liChildren = document.getElementById('ul-products').children;

    for(let i=0; i<liChildren.length; i++) {
        liChildren[i].classList.add('hide-li');
        let img = liChildren[i].children[1].children[0];
        img.addEventListener('click', (e) => {
            let description = e.target.parentElement.nextElementSibling.innerText;
            let p = document.createElement('p');
            p.innerText = description;
            divPopUpContainer.children[0].appendChild(p);
            divPopUpContainer.classList.add('active-popup');
        });
    }

    let currentPageNumber = 1; // default

    // getting all the products!
    axios.post('http://localhost:3000/gelato-creameries/store', {
        currentPageNumber: currentPageNumber
    })
     .then(result => {
         if(result.data.check === 'true') {
            let totalItems = result.data.totalItems;
            let products = result.data.products;
            let ITEMS_PER_PAGE = result.data.ITEMS_PER_PAGE;
            
            /* determining the total number of page buttons; then creating the buttons! */
            let numberOfPages = Math.ceil(totalItems/ITEMS_PER_PAGE);

            let pageNumberDiv = document.getElementsByClassName('page-numbers')[0];

            // finding out the page-number-button clicked through 'Event Bubbling'; then assigning a set of 9 products into the 'li' elements on the page!
            pageNumberDiv.addEventListener('click', (e) => {
                e.preventDefault();

                if(e.target.tagName === 'BUTTON') {
                    // hiding all 'li' elements (products) on the Front-End again!
                    for(let k=0; k<liChildren.length; k++) {
                        liChildren[k].classList.add('hide-li');
                    }

                    let pageNumbers = e.target.parentElement.children;
                    
                    for(let j=0; j<pageNumbers.length; j++) {
                        if(pageNumbers[j].classList == 'active') {
                            pageNumbers[j].classList.remove('active');
                        }
                    }

                    e.target.classList.add('active');

                    axios.post('http://localhost:3000/gelato-creameries/store', {
                        currentPageNumber: parseInt(e.target.innerText)
                    })
                     .then(result => {
                         let products = result.data.products;

                         for(let j=0; j<products.length; j++) {
                            let prodId = products[j].id;
                            let title = products[j].title;
                            let price = products[j].price;
                            let imageURL = products[j].imageURL;
                            let description = products[j].description;
    
                            // storing title
                            let header = liChildren[j].children[0];
                            header.innerText = title;
    
                            // storing imageURL
                            let img = liChildren[j].children[1].children[0];
                            img.src = imageURL;
    
                            // storing price
                            let span = liChildren[j].children[1].children[1];
                            span.innerText = "₹" + price;
    
                            // storing description
                            let p = liChildren[j].children[2];
                            p.innerText = description;
    
                            // storing prodId
                            let prodIdInput = liChildren[j].children[3];
                            prodIdInput.value = prodId;
    
                            // revealing only those 'li' elements that have information!
                            liChildren[j].classList.remove('hide-li');
                        }
                     })
                     .catch(err => console.log(err));
                }
            });

            // Page number buttons
            addingPageNumberButtons(numberOfPages, pageNumberDiv, 0); // number of pages, pageNumberDiv
            
            /* max-elements visible on page: 9 (the very first set of 9 elements)*/
            for(let i=0; i<products.length; i++) {
                let prodId = products[i].id;
                let title = products[i].title;
                let price = products[i].price;
                let imageURL = products[i].imageURL;
                let description = products[i].description;

                // storing title
                let header = liChildren[i].children[0];
                header.innerText = title;

                // storing imageURL
                let img = liChildren[i].children[1].children[0];
                img.src = imageURL;

                // storing price
                let span = liChildren[i].children[1].children[1];
                span.innerText = "₹" + price;

                // storing description
                let p = liChildren[i].children[2];
                p.innerText = description;

                // storing prodId
                let prodIdInput = liChildren[i].children[3];
                prodIdInput.value = prodId;

                // revealing only those 'li' elements that have information!
                liChildren[i].classList.remove('hide-li');
            }

            // underlining the current page number (subtracting 1 because array index starts from 0!)
            pageNumberDiv.children[currentPageNumber - 1].classList.add('active');
         }
         else {
            alert('No products available at the moment! Our Chefs and Engineers are working at high alert to bring back the cool-drool love for Gelatos. Until then please try again after a while.');
         }
     })
     .catch(err => {
        alert('Error! Please refresh the page and try again.');
     });
    
    let currentCartPageNumber = 1; // default
    
    /* fetching all the 'cart items' into the Cart from the database */
    axios.post('http://localhost:3000/gelato-creameries/get-cart', {
        currentCartPageNumber: currentCartPageNumber
    })
     .then(result => {
         let totalItems = result.data.totalItems;
         let ITEMS_IN_CART = result.data.ITEMS_IN_CART;
         let totalAmount = result.data.totalAmount;

         for(let i=0; i<result.data.products.length && i<ITEMS_IN_CART; i++) {
            let product = result.data.products[i];
            
            let prodId = product.id;
            let title = product.title;
            let price = product.price;
            let imageURL = product.imageURL;
            let description = product.description;
            let quantity = product.cartItem.quantity;

            /* Adding Product to Cart */
            addToCart(title.toUpperCase(), '₹' + price, quantity, prodId, totalAmount); // item, price, quantity, id, totalAmount
         }

         /* determining the total number of cart page-number buttons; then creating the buttons! */
         let numberOfPages = Math.ceil(totalItems/ITEMS_IN_CART);

         let cartPageNumbersDiv = document.getElementsByClassName('cart-page-numbers')[0];

         cartPageNumbersDiv.addEventListener('click', (e) => {
             e.preventDefault();

             if(e.target.tagName === "BUTTON") {
                let cartPageNumbers = e.target.parentElement.children;

                for(let j=0; j<cartPageNumbers.length; j++) {
                    if(cartPageNumbers[j].classList == 'active') {
                        cartPageNumbers[j].classList.remove('active');
                    }
                }

                e.target.classList.add('active');

                axios.post('http://localhost:3000/gelato-creameries/get-cart', {
                    currentCartPageNumber: e.target.innerText
                })
                 .then(result => {
                    let divCartItems = document.getElementsByClassName('cart-items')[0];
                    let totalItems = divCartItems.children.length;
                    let totalAmount = result.data.totalAmount;

                    // removing previous items from cart (Front-End only!)
                    while(totalItems) {
                        divCartItems.children[0].remove();
                        totalItems--;
                    }

                    // adding to cart
                    for(let i=0; i<result.data.products.length; i++) {
                        let product = result.data.products[i];
                        
                        let prodId = product.id;
                        let title = product.title;
                        let price = product.price;
                        let imageURL = product.imageURL;
                        let description = product.description;
                        let quantity = product.cartItem.quantity;
            
                        /* Adding Product to Cart */
                        addToCart(title.toUpperCase(), '₹' + price, quantity, prodId, totalAmount); // item, price, quantity, id, totalAmount
                    }
                 })
                 .catch(err => console.log(err));
             }
         });

         if(totalItems > 0) {
             // Cart page number buttons
             addingPageNumberButtons(numberOfPages, cartPageNumbersDiv, 1);

             // underlining the current cart page number (subtracting 1 because array index starts from 0!)
             cartPageNumbersDiv.children[currentCartPageNumber - 1].classList.add('active');
         }
     })
     .catch(err => console.log(err));
    
    const navCart = document.getElementById('nav-cart');
    const cart = document.getElementById('cart');
    let payAmount = parseInt(document.getElementById('pay-amount').innerText); /* Total Amount Sum */
    
    navCart.addEventListener('click', (e) => {
        navCart.classList.toggle('active');
        cart.classList.toggle('active');
    });
    
    /* "ADD TO CART" by finding 'click' event through Event Bubbling! */
    document.getElementById('ul-products').addEventListener('click', (e) => {
        e.preventDefault();
        
        if(e.target.tagName == "BUTTON" && e.target.className == "add-to-cart") {
            let item = e.target.parentElement.previousElementSibling.innerText;
            let price = e.target.previousElementSibling.innerText;
            let prodId = e.target.parentElement.nextElementSibling.nextElementSibling.value;

            /* checking if the item already exists in the Cart (database); if not then item gets added to the Cart */
            axios.post('http://localhost:3000/gelato-creameries/check-cart', {
                prodId: prodId
            })
            .then(result => {
                // item already exists in the Cart
                if(result.data.check === 'true') {
                    alert('ALREADY ADDED TO CART!');
                }
                // new item being added to the Cart
                else {
                    axios.post('http://localhost:3000/gelato-creameries/cart', {
                        prodId: prodId,
                        quantity: 1
                    })
                    .then(result => {
                        if(result.data.check === 'false') {
                            alert(`Error! Could not add item to cart. Please refresh the page.`);
                        }
                        else {
                            let totalItems = result.data.totalItems;
                            let ITEMS_IN_CART = result.data.ITEMS_IN_CART;
                            let totalAmount = result.data.totalAmount;

                            let numberOfPages = Math.ceil(totalItems/ITEMS_IN_CART);
                            let cartPageNumberDiv = document.getElementsByClassName('cart-page-numbers')[0];

                            /* Cart page number buttons + Adding Product to Cart (Front-End)  => both together! */
                            addingPageNumberButtons(numberOfPages, cartPageNumberDiv, 1);

                            /* 'ONLY FOR THE VERY FIRST ITEM IN CART' - Adding Product to Cart (Front-End) */
                            if(totalItems === 1) {
                                addToCart(item, price, 1, prodId, totalAmount); // item, price, quantity, id, totalAmount
                            }
                
                            /* Toast Notification */
                            let divNotificationContainer = document.getElementsByClassName('notification-container')[0];
                            let divContainer = document.createElement('div');
                            let spanItemName = document.createElement('span');
                            spanItemName.id = 'notification-item-name';
                            spanItemName.innerText = item;
                            let spanText = document.createElement('span');
                            spanText.innerText = ' HAS BEEN ADDED TO CART';
                            let divNotification = document.createElement('div');
                            divNotification.id = 'notification';
                            divNotification.appendChild(spanItemName);
                            divNotification.appendChild(spanText);
                            divContainer.appendChild(divNotification);
                            divNotificationContainer.appendChild(divContainer);
                
                            setTimeout(() => divContainer.remove(), 5000);
                        }
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
        }
    });
    
    /* FLYER/CART PAGE NUMBER BUTTONS */
    function addingPageNumberButtons(numberOfPages, pageNumberDiv, flag) {
        let count = 0, activeCartPageNumber;

        let totalPageButtons_1 = pageNumberDiv.children.length, flag2 = 0; // to check for an edge case

        // only for Cart!
        if(flag === 1) {
            let totalPageButtons = pageNumberDiv.children.length;

            // setting "active" page button for an empty Cart
            if(totalPageButtons == 0) {
                activeCartPageNumber = 1;
            }

            // removing previous Cart page buttons; also finding the "active" button
            while(totalPageButtons) {
                if(pageNumberDiv.children[0].className === 'active') {
                    activeCartPageNumber = parseInt(pageNumberDiv.children[0].innerText);
                }
                pageNumberDiv.children[0].remove();
                totalPageButtons--;
            }
        }

        if(flag == 1 && numberOfPages < activeCartPageNumber) {
            flag2 = 1;

            // x, y, activeCartPageNumber, pageNumberDiv
            edgeCaseAddToCart(numberOfPages, numberOfPages, numberOfPages, pageNumberDiv);
        }
        else if(flag == 1 && numberOfPages <= totalPageButtons_1) {
            flag2 = 1;
            
            let divCartItems = document.getElementsByClassName('cart-items')[0];
            let totalItems = divCartItems.children.length;

            // removing previous items from cart (Front-End only!)
            while(totalItems) {
                divCartItems.children[0].remove();
                totalItems--;
            }

            // x, y, activeCartPageNumber, pageNumberDiv
            edgeCaseAddToCart(activeCartPageNumber, numberOfPages, activeCartPageNumber, pageNumberDiv);
        }

        if(flag2 == 0) {
            while(numberOfPages) {
                count++; // current Page Number
                numberOfPages--;
    
                let pageNumberButton = document.createElement('button');
                pageNumberButton.innerText = count;
    
                // only for Cart!
                if(flag == 1 && activeCartPageNumber == count) {
                    pageNumberButton.classList.add('active');
                }

                pageNumberDiv.appendChild(pageNumberButton);
            }
        }
    }

    function edgeCaseAddToCart(x, y, activeCartPageNumber, pageNumberDiv) {
        axios.post('http://localhost:3000/gelato-creameries/get-cart', {
            currentCartPageNumber: x
        })
        .then(result => {
            let totalItems = result.data.totalItems;
            let ITEMS_IN_CART = result.data.ITEMS_IN_CART;
            let totalAmount = result.data.totalAmount;
    
            for(let i=0; i<result.data.products.length && i<ITEMS_IN_CART; i++) {
                let product = result.data.products[i];
                
                let prodId = product.id;
                let title = product.title;
                let price = product.price;
                let imageURL = product.imageURL;
                let description = product.description;
                let quantity = product.cartItem.quantity;
    
                /* Adding Product to Cart */
                addToCart(title.toUpperCase(), '₹' + price, quantity, prodId, totalAmount); // item, price, quantity, id, totalAmount
            }

            return;
        })
        .then(() => {
            let count = 0;

            while(y) {
                count++; // current Page Number
                y--;
    
                let pageNumberButton = document.createElement('button');
                pageNumberButton.innerText = count;

                if(activeCartPageNumber == count) {
                    pageNumberButton.classList.add('active');
                }
    
                pageNumberDiv.appendChild(pageNumberButton);
            }
        })
        .catch(err => {
            console.log(err);
            //location.reload();
        });
    }

    /* a common function to place items in the Cart either by clicking 'ADD TO CART' (Front-End) or loading from the Cart's database (Back-End) on refreshing the page */
    function addToCart(item, price, quantity, prodId, totalAmount) {
        let divCartItems = document.getElementsByClassName('cart-items');
        
        if(divCartItems[0].children.length !== 3) {
            let divCartRow = document.createElement('div');
            divCartRow.className = "cart-row";
            divCartRow.id = item;
        
            // item
            let spanItem = document.createElement('span');
            spanItem.className = "cart-item cart-column";
            let spanItem_Name = document.createElement('span');
            spanItem_Name.innerText = item; // stores in the Item Name
            spanItem.appendChild(spanItem_Name);
        
            // price
            let spanPrice = document.createElement('span');
            spanPrice.className = "cart-price cart-column";
            spanPrice.innerText = price; // stores in the Price
        
            // quantity
            let spanQuantity = document.createElement('span');
            spanQuantity.className = "cart-quantity cart-column";
            spanQuantity.innerText = "x";
            let inputQuantity = document.createElement('input');
            inputQuantity.type = "number";
            inputQuantity.name = "quantity";
            inputQuantity.value = quantity;
            inputQuantity.min = "1";
            inputQuantity.max = "5";
            spanQuantity.appendChild(inputQuantity);
    
            // id
            let spanId = document.createElement('span');
            spanId.className = "cart-id";
            spanId.innerText = prodId; // stores in the Id of the product (for database purposes!)
        
            // remove button
            let divRemove = document.createElement('div');
            divRemove.className = "cart-remove";
            let buttonRemove = document.createElement('button');
            buttonRemove.type = "submit";
            buttonRemove.name = "remove";
            buttonRemove.id = "remove";
            buttonRemove.innerText = "REMOVE";
            divRemove.appendChild(buttonRemove);
        
            divCartRow.appendChild(spanItem);
            divCartRow.appendChild(spanPrice);
            divCartRow.appendChild(spanQuantity);
            divCartRow.appendChild(spanId);
            divCartRow.appendChild(divRemove);
        
            divCartItems[0].appendChild(divCartRow);
        }

        /* Total Amount Sum */
        TotalPurchaseAmount(totalAmount);
    }

    /* "Quantity Change" (in cart) / "REMOVE" (from cart) by finding 'click' event through Event Bubbling! */
    document.getElementsByClassName('cart-items')[0].addEventListener('click', (e) => {
        e.preventDefault();
        
        // "Quantity Change"
        if(e.target.tagName == 'INPUT' && e.target.name == 'quantity') {
            let title = e.target.parentElement.parentElement.firstElementChild.children[0].innerText;
            let prodId = e.target.parentElement.nextElementSibling.innerText;
            let quantity = e.target.value;

            // updating the Quantity in the Cart database (Back-End)
            axios.post('http://localhost:3000/gelato-creameries/cart', {
                prodId: prodId,
                quantity: quantity
            })
             .then(result => {
                 let totalAmount = result.data.totalAmount;

                 /* Total Amount Sum */
                 TotalPurchaseAmount(totalAmount);
             })
             .catch(err => {
                 console.log(err);
                 alert(`Error! Could not update the quantity of the following product '${title}' in the Cart. Please refresh the page and try again.`);
             });
        }

        // "REMOVE"
        if(e.target.tagName == "BUTTON" && e.target.id == "remove") {
            let prodId = e.target.parentElement.previousElementSibling.innerText;
            let title = e.target.parentElement.parentElement.firstElementChild.children[0].innerText;

            // removing from the Cart database (Back-End)
            axios.post('http://localhost:3000/gelato-creameries/cart/remove', {
                prodId: prodId
            })
             .then(result => {
                 if(result.data.check === 'false') {
                     // Error! Trying to remove a product that does not exist in the database. Refreshing the page to resolve the problem.
                     location.reload();
                 }
                 else {
                     // removing from Front-End
                     let buttonRemove = e.target;
                     let divCartRow = buttonRemove.parentElement.parentElement;
                     divCartRow.remove();

                     let totalAmount = result.data.totalAmount;
                     let totalItems = result.data.totalItems;
                     let ITEMS_IN_CART = result.data.ITEMS_IN_CART;

                     let numberOfPages = Math.ceil(totalItems/ITEMS_IN_CART);
                     let cartPageNumberDiv = document.getElementsByClassName('cart-page-numbers')[0];

                     /* Total Amount Sum */
                     TotalPurchaseAmount(totalAmount);

                     addingPageNumberButtons(numberOfPages, cartPageNumberDiv, 1);
                 }
             })
             .catch(err => {
                console.log(err);
                alert(`ERROR! COULD NOT REMOVE THE FOLLOWING PRODUCT '${title}' FROM THE CART. PLEASE REFRESH THE PAGE AND TRY AGAIN.`);
             });
        }
    });
    
    /* change in quantity / remove / clicking 'ADD TO CART' / loading products from Back-End on refreshing => change in Total Amount Sum */
    function TotalPurchaseAmount(totalAmount) {
        // updating Total Amount Sum (on Front-End)
        document.getElementById('pay-amount').innerText = totalAmount;
    }
    
    /* PURCHASE */
    document.getElementById('purchase').addEventListener('click', (e) => {
        e.preventDefault();
    
        let divCartItems = document.getElementsByClassName('cart-items');
    
        let countOfItemsInCart = divCartItems[0].childElementCount;
    
        if(countOfItemsInCart === 0) {
            alert('YOUR CART IS EMPTY! PLEASE CHOOSE FROM OUR SELECTION OF HAND-MADE GELATOS FIRST. ONLY THEN WILL YOU BE ALLOWED TO PROCEED TO CHECK-OUT.')
        }
        else {
            axios.post('http://localhost:3000/gelato-creameries/place-order')
             .then(result => {
                 if(result.data.check == 'true') {
                     alert(`YOUR ORDER NUMBER IS #${result.data.orderNo} *** THANK YOU FOR MAKING A DELICIOUS PURCHASE! DO BOTHER US AGAIN! (NO-PUN-INTENDED) ***`);
            
                     for(let i=0; i<countOfItemsInCart; i++) {
                         divCartItems[0].children[0].remove();
                     }
            
                     /* removing cart page buttons */
                     let cartPageNumberButtons = document.getElementsByClassName('cart-page-numbers')[0].children;
                     for(let i=0; i<cartPageNumberButtons.length; i++) {
                         cartPageNumberButtons[0].remove();
                     }

                     /* resetting Total Amount Sum */
                     payAmount = 0; // updating
                     document.getElementById('pay-amount').innerText = 0; // on Front-End
                 }
                 else {
                     alert('SOMETHING WENT WRONG! TRY REFRESHING THE PAGE.');
                 }
             })
             .catch(err => {
                 console.log(err);
                 alert(`ERROR! CLICK 'OK' TO REFRESH THE PAGE.`);
                 location.reload();
             });
        }
    });
});
