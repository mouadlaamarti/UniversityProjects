document.addEventListener('DOMContentLoaded', () => {

    let navbar = document.querySelector('.navbar');
    let searchForm = document.querySelector('.search-form');
    //let itemContainer = document.querySelector('.items-container');
    let signInForm = document.querySelector('#signin-form');

    const toggleNavbar = () => {
        navbar.classList.toggle('active');
        searchForm.classList.remove('active');
        //itemContainer.classList.remove('active');
    };

    const toggleSearchForm = () => {
        searchForm.classList.toggle('active');
        navbar.classList.remove('active');
        //itemContainer.classList.remove('active');
    };

    const toggleItemContainer = () => {
        //itemContainer.classList.toggle('active');
        navbar.classList.remove('active');
        searchForm.classList.remove('active');
    };


    document.querySelector('#menu-btn').addEventListener('click', toggleNavbar);
    document.querySelector('#search-btn').addEventListener('click', toggleSearchForm);
    document.querySelector('#item-btn').addEventListener('click', toggleItemContainer);


    window.addEventListener('scroll', () => {
        navbar.classList.remove('active');
        searchForm.classList.remove('active');
        //itemContainer.classList.remove('active');
    });


    const handleSignIn = async (e) => {
        e.preventDefault();
        // Get form data
        const formData = new FormData(signInForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
            } else {

                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Login error:', error.message);
        }
    };
    window.onload = function(){
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        const cartOverlay = document.querySelector('.cart-overlay');
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartItemsList = document.querySelector('.cartItemsList');
        var overlay = document.getElementById('cartOverlay');
        var closeCartBtn = document.getElementById('closeCart');


        closeCartBtn.addEventListener('click', function() {
            overlay.style.display = 'none';
        });
    
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                var productId = button.getAttribute('data-product-id');
                var productName = button.getAttribute('data-product-name');
                var productPrice = button.getAttribute('data-product-price');
                fetch('/add-to-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id:productId, name:productName, price:productPrice })
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to add item to cart');
                    }
                })
                .then(data => {
                    // Display the added item in the cart
                    displayCartItem(data.product);
                })
                .catch(error => {
                    console.error('Error adding item to cart:', error);
                });
            });
        });
    
        const displayCartItem = (product) => {
            var noItemsMessage = cartItemsList.querySelector('p');
            if (noItemsMessage) {
                noItemsMessage.remove();
            }

            var itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `<span>${product.name}</span> - <span>$${product.price}</span>`;
            itemDiv.innerHTML = `<span>${product.name}</span> - <span>$${product.price}</span>
            <button class="remove-from-cart-btn" data-product-id="${product.id}">Delete</button>
        `;
        itemDiv.querySelector('.remove-from-cart-btn').addEventListener('click', () => {
            const productId = itemDiv.querySelector('.remove-from-cart-btn').getAttribute('data-product-id');
            removeCartItem(productId);
            itemDiv.remove(); // Remove the item from the cart UI
        });
            cartItemsList.appendChild(itemDiv);
            
        };
    
        const openCartOverlay = () => {
            cartOverlay.style.display = 'flex';
        };
    
        const closeCartOverlay = () => {
            cartOverlay.style.display = 'none';
        };
    
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('close-cart')) {
                closeCartOverlay();
            }
            if (event.target.classList.contains('fa-shopping-cart')) {
                openCartOverlay();
            }
            if (event.target.classList.contains('remove-from-cart-btn')) {
                const productId = event.target.getAttribute('data-product-id');
                removeCartItem(productId);
            }
        });
    };
    
    const removeCartItem = (productId) => {
        let cart = [];
        const index = cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            // Remove the item from the cart array
            cart.splice(index, 1);
    
            // Remove the item from the cart UI
            const cartItemToRemove = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
            if (cartItemToRemove) {
                cartItemToRemove.remove();
            }
    
            // If the cart is empty, display a message
            if (cart.length === 0) {
                cartItemsList.innerHTML = "<p>No items in your cart.</p>";
            }
        } else {
            console.log('Item removed:', productId);
        }
    };
    const checkout = async () => {
        try {
          const cartItems = getCartItems();
          console.log('Cart items:', cartItems);
          if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
          }
      
          const response = await fetch('/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartItems),
          });
      
          const data = await response.json();
          if (response.ok) {
            alert('Order successful');
            clearCart();
          } else {
            alert('Failed to process order. Please try again later.');
          }
        } catch (error) {
          console.error('Error during checkout:', error);
          alert('An error occurred. Please try again later.');
        }
      };
      
      const getCartItems = () => {
        const cartItems = Array.from(document.querySelectorAll('.cart-item')).map(item => {
          return {
            id: item.dataset.productId,
            name: item.dataset.productName,
            price: parseFloat(item.dataset.productPrice),
          };
        });
        return cartItems;
      };
      
      const clearCart = () => {
      };
      
      document.querySelector('.checkout-btn').addEventListener('click', checkout);
    
    document.getElementById('about').addEventListener('click', function() {
        const query = document.getElementById('about').value;
        window.location.href = `/about${encodeURIComponent(query)}`;
    });
});

