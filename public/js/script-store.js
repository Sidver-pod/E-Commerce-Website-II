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

    // getting all the products!
    axios.get('http://localhost:3000/gelato-creameries/store')
     .then(result => {
         if(result.data.check === 'true') {
            let products = result.data.products;
            
            /* determining the total number of page buttons; then creating the buttons! */
            let numberOfPages = Math.floor(products.length/9) + 1;

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

                    let pageNumber = parseInt(e.target.innerText);
                    let end = (9 * pageNumber) - 1;
                    let start = end - 8;

                    for(let j=start; j<products.length; j++) {
                        if(j <= end) {
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
                        else {
                            break;
                        }
                    }
                }
            });

            // page-number-buttons
            let count = 0;
            while(numberOfPages > 0) {
                count++; // current Page Number
                numberOfPages--;

                let pageNumberButton = document.createElement('button');
                pageNumberButton.innerText = count;
                pageNumberDiv.appendChild(pageNumberButton);
            }
            
            /* max-elements visible on page: 9 (the very first set of 9 elements)*/
            for(let i=0; i<products.length && i<9; i++) {
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
            // underlining the first page-number by default!
            pageNumberDiv.firstElementChild.classList.add('active');
         }
         else {
            alert('No products available at the moment! Our Chefs and Engineers are working at high alert to bring back the cool-drool love for Gelatos. Until then please try again after a while.');
         }
     })
     .catch(err => {
        alert('Error! Please refresh the page and try again.');
     });
    
    /* fetching all the 'cart items' into the Cart from the database */
    axios.get('http://localhost:3000/gelato-creameries/cart')
     .then(products => {
         for(let i=0; i<products.data.length; i++) {
            let product = products.data[i];
            
            let prodId = product.id;
            let title = product.title;
            let price = product.price;
            let imageURL = product.imageURL;
            let description = product.description;
            let quantity = product.cartItem.quantity;

            /* Adding Product to Cart */
            addToCart(title.toUpperCase(), '₹' + price, quantity, prodId); // item, price, quantity, id
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

            /* checking if the item already exists in the cart */
            let flag = 0;
            let xInCart = document.getElementsByClassName('cart-row');
            for(let i=0; i<xInCart.length; i++) {
                if(item == xInCart[i].id) {
                    flag = 1;
                    break;
                }
            }
    
            if(flag === 0) {
                axios.post('http://localhost:3000/gelato-creameries/cart', {
                    prodId: prodId,
                    quantity: 1
                })
                .then(result => {
                    if(result.data.check === 'false') {
                        alert(`Error! Could not add item to cart. Please refresh the page.`);
                    }
                    else {
                        /* Adding Product to Cart */
                        addToCart(item, price, 1, prodId); // item, price, quantity, id
            
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
            else {
                alert('ALREADY ADDED TO CART!');
            }
        }
    });
    
    /* a common function to place items in the Cart either by clicking 'ADD TO CART' (Front-End) or loading from the Cart's database (Back-End) on refreshing the page */
    function addToCart(item, price, quantity, prodId) {
        let divCartItems = document.getElementsByClassName('cart-items');
        
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
        /* quantity change ~ price change; updating Total Amount Sum */
        inputQuantity.addEventListener('click', TotalPurchaseAmount);
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

        /* Total Amount Sum */
        TotalPurchaseAmount();
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

             })
             .catch(err => {
                 console.log(err);
                 alert(`Error! Could not update the quantity of the following product '${title}' in the Cart. Please refresh the page and try again.`);
             });

            /* Total Amount Sum */
            TotalPurchaseAmount();
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
                 if(result.data.check != 'true') {
                     // Error! Trying to remove a product that does not exist in the database. Refreshing the page to resolve the problem.
                     location.reload();
                 }
             })
             .catch(err => {
                console.log(err);
                alert(`Error! Could not remove the following product '${title}' from the Cart. Please refresh the page and try again.`);
             });

            let buttonRemove = e.target;
            let divCartRow = buttonRemove.parentElement.parentElement;
            divCartRow.remove();
            /* Total Amount Sum */
            TotalPurchaseAmount();
        }
    });
    
    /* change in quantity / remove / clicking 'ADD TO CART' / loading products from Back-End on refreshing => change in Total Amount Sum */
    function TotalPurchaseAmount() {
    
        payAmount = 0; // resetting Total Amount Sum
        
        let divCartItems = document.getElementsByClassName('cart-items');
    
        let countOfItemsInCart = divCartItems[0].childElementCount;
    
        for(let i=0; i<countOfItemsInCart; i++) {
            let divItem = divCartItems[0].children[i];
            let price = parseInt(divItem.children[1].innerText.split('₹')[1]);
            let quantity = divItem.children[2].children[0].value;
            payAmount += quantity * price; // updating
        }
    
        // updating Total Amount Sum (on Front-End)
        document.getElementById('pay-amount').innerText = payAmount;
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
            alert('*** THANK YOU FOR MAKING A DELICIOUS PURCHASE! DO BOTHER US AGAIN! (NO-PUN-INTENDED) ***');
            
            for(let i=0; i<countOfItemsInCart; i++) {
                divCartItems[0].children[0].remove();
            }
    
            /* resetting Total Amount Sum */
            payAmount = 0; // updating
            document.getElementById('pay-amount').innerText = 0; // on Front-End
        }
    });
});
