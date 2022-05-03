document.addEventListener('DOMContentLoaded', (e) => {
    axios.get('http://localhost:3000/gelato-creameries/get-order')
     .then(result => {
         if(result.data.check == 'true') {
             let orders = result.data.orders;

             if(orders.length == 0) {
                 alert(`NO ORDER HISTORY! YOU HAVEN'T PURCHASED ANYTHING.`);
             }
             else {
                 orders.forEach(order => {
                     let ul = document.getElementById('ul-products');
                     let li = document.createElement('li');
                     let div = document.createElement('div');
                     div.className = "order-row";

                     let id = order.id;
                     let headerOrderId = document.createElement('header');
                     headerOrderId.innerText = `ORDER #${id}`;

                     li.appendChild(headerOrderId);

                     // table
                     let table = document.createElement('table');
                     table.className = "invoice-table";

                     // table head
                     let thead = document.createElement('thead');

                     // table row - head
                     let tr_head = document.createElement('tr');

                     // table data cell - S.No.
                     let tdSNo = document.createElement('td');
                     tdSNo.innerText = 'S.NO.';

                     // table data cell - ITEM
                     let tdItem = document.createElement('td');
                     tdItem.innerText = 'ITEM';

                     // table data cell - QTY
                     let tdQty = document.createElement('td');
                     tdQty.innerText = 'QTY';

                     // table data cell - PRICE
                     let tdPrice = document.createElement('td');
                     tdPrice.innerText = 'PRICE';

                     tr_head.appendChild(tdSNo);
                     tr_head.appendChild(tdItem);
                     tr_head.appendChild(tdQty);
                     tr_head.appendChild(tdPrice);
                     thead.appendChild(tr_head);
                     table.appendChild(thead);

                     // table body
                     let tbody = document.createElement('tbody');
                     let count = 0; // S.No.
                     let sumPrice = 0; // total amount

                     order.products.forEach(product => {
                         count++; // updating
                         let title = product.title;
                         let quantity = product.orderItem.quantity;
                         let price = product.price;

                         // table row - body
                         let tr_body = document.createElement('tr');

                         // table data cell - S.No.
                         let tdSNo = document.createElement('td');
                         tdSNo.innerText = count;

                         // table data cell - ITEM
                         let tdItem = document.createElement('td');
                         tdItem.innerText = title;

                         // table data cell - QTY
                         let tdQty = document.createElement('td');
                         tdQty.innerText = 'x' + quantity;
                         tdQty.style.textTransform = "lowercase";

                         // table data cell - PRICE
                         let tdPrice = document.createElement('td');
                         tdPrice.innerText = '₹' + price;
                         sumPrice += price * quantity;

                         tr_body.appendChild(tdSNo);
                         tr_body.appendChild(tdItem);
                         tr_body.appendChild(tdQty);
                         tr_body.appendChild(tdPrice);
                         tbody.appendChild(tr_body);
                     });

                     table.appendChild(tbody);

                     let tfoot = document.createElement('tfoot');
                     let tr_foot = document.createElement('tr');
                     
                     let tdTotal = document.createElement('td');
                     tdTotal.colSpan = 3;
                     tdTotal.style.textAlign = "right";
                     tdTotal.innerText = 'TOTAL';
                     
                     let tdTotalAmount = document.createElement('td');
                     tdTotalAmount.innerText = '₹' + sumPrice;

                     tr_foot.appendChild(tdTotal);
                     tr_foot.appendChild(tdTotalAmount);
                     tfoot.appendChild(tr_foot);

                     table.appendChild(tfoot);
                     li.appendChild(table);
                     ul.appendChild(li);
                 });
             }
         }
     })
     .catch(err => {
         console.log(err);
         alert(`ERROR! PLEASE REFRESH YOUR PAGE.`);
     });
});
