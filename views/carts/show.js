const layout = require('../layout');

module.exports = ({ items }) => {

    //calculating the  total price for items we add to cart/ we use reduce function to iterate through every item and for every item we run the function
    //passing  arguments which are (prev, item) // prev is accumulator , item is the thing we are iterating over
    //the first time the function run it takes 0 (sec arg) and pass it as prev value
    const totalPrice = items.reduce((prev, item) => {
        return prev + item.quantity * item.product.price
    }, 0); // 0 is sec argument

  const renderedItems = items
    .map(item => {
      return `
        <div class="cart-item message">
          <h3 class="subtitle">${item.product.title}</h3>
          <div class="cart-right">
            <div>
              $${item.product.price}  X  ${item.quantity} = 
            </div>
            <div class="price is-size-4">
              $${item.product.price * item.quantity}
            </div>
            <div class="remove">
              <form method="POST" action="/cart/products/delete">
              <input hidden value="${item.id}" name="itemId" /> <!-- we add these prop to make sure server understand which item we want to delete-->
                <button class="button is-danger">                  
                  <span class="icon is-small">
                    <i class="fas fa-times"></i>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  return layout({
    content: `
      <div id="cart" class="container">
        <div class="columns">
          <div class="column"></div>
          <div class="column is-four-fifths">
            <h3 class="subtitle"><b>Shopping Cart</b></h3>
            <div>
              ${renderedItems}
            </div>
            <div class="total message is-info">
              <div class="message-header">
                Total
              </div>
              <h1 class="title">$${totalPrice}</h1>
              <button class="button is-primary">Buy</button>
            </div>
          </div>
          <div class="column"></div>
        </div>
      </div>
    `
  });
};
