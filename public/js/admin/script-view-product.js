document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();

    let buttonAddProducts = document.getElementById('add-products');

    buttonAddProducts.addEventListener('mouseover', (e) => {
        let divH1 = document.getElementsByClassName('h1')[0];
        divH1.style.border = "1px solid black";
    });
    buttonAddProducts.addEventListener('mouseout', (e) => {
        let divH1 = document.getElementsByClassName('h1')[0];
        divH1.style.border = "1px dashed black";
    });

    // Pop-Up
    let divPopUpContainer = document.getElementById('container');

    // close button on Pop-Up
    let buttonClose = document.getElementById('close');
    buttonClose.addEventListener('click', (e) => {
        divPopUpContainer.classList.remove('active');
    });

    // event bubbling!
    let ul = document.getElementsByTagName('ul')[0];
    ul.addEventListener('click', (e) => {
        e.preventDefault();

        if(e.target.type === 'submit') {
            if(e.target.className === 'edit') {
                let id = e.target.parentElement.previousElementSibling.value;
                let title = e.target.parentElement.parentElement.previousElementSibling.innerText;
                let price = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerText;
                let imageURL = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.src;
                let description = e.target.parentElement.previousElementSibling.previousElementSibling.innerText;

                // filling in values into the inputs of Pop-Up form
                document.getElementById('id').value = id;
                document.getElementById('title').value = title;
                document.getElementById('price').value = price;
                document.getElementById('imageURL').value = imageURL;
                document.getElementById('description').value = description;

                // opening the Pop-Up
                divPopUpContainer.classList.add('active');
            }
            else if(e.target.className === 'delete') {
                let id = e.target.parentElement.previousElementSibling.value;
                let title = e.target.parentElement.parentElement.previousElementSibling.innerText;
                axios.post('http://54.175.242.147:3000/admin/delete-product', {
                    id: id
                })
                 .then(result => {
                     if(result.data.check === 'true') {
                         alert(`The following product '${title}' has been successfully deleted from the database!`);
                         location.reload();
                     }
                     else {
                        alert('Error! Could not delete. Please refresh the page and try again.');
                     }
                 })
                 .catch(err => {
                    console.log(err);
                    alert('Error! Could not delete. Please refresh the page and try again.');
                 });
            }
        }
    });

    // sending GET request to BACK-END to retrieve all the data from the 'Product' table
    axios.get('http://54.175.242.147:3000/admin/view-product')
     .then(result => {
         if(result.data.check === 'true') {
             let products = result.data.products;
             let ul = document.getElementsByTagName('ul')[0];

             for(let i=0; i<products.length; i++) {
                let id = products[i].id;
                let title = products[i].title;
                let price = products[i].price;
                let imageURL = products[i].imageURL;
                let description = products[i].description;

                let li = document.createElement('li');
                let div = document.createElement('div');

                /* title */
                let header = document.createElement('header');
                header.innerText = title;

                /* img */
                let img = document.createElement('img');
                img.src = imageURL;
                img.style.visibility = "hidden";
                img.style.display = "none";

                /* price */
                let span1 = document.createElement('span');
                span1.innerText = price;
                span1.style.visibility = "hidden";
                span1.style.display = "none";

                /* description */
                let span2 = document.createElement('span');
                span2.innerText = description;
                span2.style.visibility = "hidden";
                span2.style.display = "none";

                /* 'edit' & 'delete' buttons */
                let span3 = document.createElement('span');
                span3.className = "edit-del-buts";

                let button1 = document.createElement('button');
                button1.type = "submit";
                button1.className = "edit";
                button1.innerText = "edit";

                let button2 = document.createElement('button');
                button2.type = "submit";
                button2.className = "delete";
                button2.innerText = "delete";

                /* input */
                let input = document.createElement('input');
                input.type = "hidden";
                input.name = "id";
                input.value = id;

                span3.appendChild(button1);
                span3.appendChild(button2);

                div.appendChild(img);
                div.appendChild(span1);
                div.appendChild(span2);
                div.appendChild(input);
                div.appendChild(span3);
                li.appendChild(header);
                li.appendChild(div);
                ul.appendChild(li);
             }
         }
         else {
             alert('No products added!');
         }
     })
     .catch(err => console.log(err));
});

function updateProduct() {
    let id = document.getElementById('id').value;
    let title = document.getElementById('title').value;
    let price = document.getElementById('price').value;
    let imageURL = document.getElementById('imageURL').value;
    let description = document.getElementById('description').value;

    axios.put('http://54.175.242.147:3000/admin/update-product', {
        id: id,
        title: title,
        price: price,
        imageURL: imageURL,
        description: description
    })
     .then(result => {
        if(result.data.check === 'true') {
            alert(`The following product '${title}' has been successfully updated in the database!`);
            location.reload();
        }
        else {
            alert('Error! Could not update. Please refresh the page and try again.');
        }
     })
     .catch(err => {
        console.log(err);
        alert('Error! Could not update. Please refresh the page and try again.');
     });
}
