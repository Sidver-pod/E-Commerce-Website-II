document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();

    let buttonViewProducts = document.getElementById('view-products');
    buttonViewProducts.addEventListener('mouseover', (e) => {
        let divH1 = document.getElementsByClassName('h1')[0];
        divH1.style.border = "1px solid black";
    });
    buttonViewProducts.addEventListener('mouseout', (e) => {
        let divH1 = document.getElementsByClassName('h1')[0];
        divH1.style.border = "1px dashed black";
    });
});

function addProduct() {
    let titleInput = document.getElementById('title');
    let imageURLInput = document.getElementById('imageURL');
    let priceInput = document.getElementById('price');
    let descriptionInput = document.getElementById('description');

    // extracting data from input fields
    let title = titleInput.value;
    let imageURL = imageURLInput.value;
    let price = priceInput.value;
    let description = descriptionInput.value;

    // emtying the input fields on the FRONT-END
    titleInput.value = "";
    imageURLInput.value = "";
    priceInput.value = "";
    descriptionInput.value = "";

    // sending a POST request to the BACK-END
    axios.post('http://localhost:3000/admin/add-product', {
        title: title,
        imageURL: imageURL,
        price: price,
        description: description
    })
     .then(result => {
         console.log('product add: CHECK', title, imageURL, price, description);
         console.log(result);
         alert(`The following product '${title}' has been successfully added to the database!`);
        //  location.reload();
     })
     .catch(err => {
        console.log(err);
        alert(`Error! Please refresh the page and try again.`);
     });
}
