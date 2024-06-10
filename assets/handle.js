var productData = {{ product | json }};

                  var productName = productData.title;
                  var productPrice = productData.price;

                  function addProductToLocalStorage(product) {
                    var existingProducts = JSON.parse(localStorage.getItem('products')) || [];

                    var productExists = existingProducts.some(function(existingProduct) {
                      return existingProduct.name === product.name;
                    });

                    if (!productExists) {
                      existingProducts.push(product);
                      localStorage.setItem('products', JSON.stringify(existingProducts));
                      console.log('Product added to local storage:', product);
                    } else {
                      console.log('Product already exists in local storage:', product);
                    }
                  }

                  document.getElementById('addToBundleButton').addEventListener('click', function() {
                    var productDetails = {
                      name: productName,
                      price: productPrice
                    };

                    addProductToLocalStorage(productDetails);
                  });