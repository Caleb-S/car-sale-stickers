var clientSecret; // <---------------- this why not working (clientSecret const && set to false, should be set to none)
var intentID;
const url = "https://0q0j7hxr83.execute-api.ap-southeast-2.amazonaws.com/test-stage-v1/stripe";
var country;
var ipaddr;
var shippingMethod = 'budget';
var shippingPrices = {

    "standard": "19.32",
    "express": "38.88",
    "overnight": "40.13"
}


var elements;


document.addEventListener("DOMContentLoaded", async () => {

    var budgetOption = document.getElementById("budget");
    var standardOption = document.getElementById("standard");
    var expressOption = document.getElementById("express");

    var budgetPrice = document.getElementById("budget-price");
    var standardPrice = document.getElementById("standard-price");
    var expressPrice = document.getElementById("express-price");

    // =============================================================================
    // Initialization Section
    // =============================================================================
    async function fetchUserIP() {
        try {
            const response = await fetch("https://api.bigdatacloud.net/data/client-ip");
            const data = await response.json();
            ipaddr = data.ipString;
            console.log(ipaddr);
            return data.ipString;
        } catch (error) {
            console.error(error);
            return null; // Return null if the IP fetch fails
        }
    }
    await fetchUserIP();

    const stripe = Stripe(
        "pk_test_51NWg86IA9Fl1A3IGTsyLEeLB83hHQu0kIH8OFZipQP1BAklKyzEOnzNmrjDHyt7eRKYgeZcBwI45Bzxn60Z6icUg009NOrOYZq"
    );
    const items = [{ id: "xl-tshirt" }];



    // Initialize Stripe elements and UI components


    // Check the payment status


    // Event listener for form submission
    document
        .querySelector("#payment-form");


    let emailAddress = "";

    // =============================================================================
    // Create Payment Intent
    // =============================================================================



    console.log(cart);

    var payload = {
        requestType: "paymentIntent",
        customerDetails: {
            ipAddress: await fetchUserIP(),// Assuming the email is the same for all items in the cart
        },
        cart: cart.map(cartItem => {
            const productItem = {
                productID: cartItem.item === "For Sale Sticker" ? "forSaleSticker" : cartItem.item,
                quantity: 1, // If you want to keep track of quantity, you need to modify the cart data accordingly
            };

            // Add phoneOption to productItem if not null or empty
            if (cartItem.phone) {
                productItem.phoneOption = cartItem.phone;
            }

            // Add emailOption to productItem if not null or empty
            if (cartItem.email) {
                productItem.emailOption = cartItem.email;
            }

            return productItem;
        }),
    };

    console.log(JSON.stringify(payload, null, 2));
    // Perform the POST request
    const fetchData = fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            var parsedData = JSON.parse(data.body);
            clientSecret = parsedData.clientSecret;
            intentID = parsedData.intentID;
            console.log(parsedData);

            shippingPrices = data.shippingQuotes;
            console.log(shippingPrices);





            if (!('budget' in shippingPrices)) {
                budgetOption.style.display = 'none';

            } else {
                budgetOption.style.display = 'flex';
            }

            if ('standard' in shippingPrices) {
                standardOption.style.display = 'flex';
                standardPrice.textContent = "$" + shippingPrices.standard;
                console.log('payment triggered it');

            } else {
                standardOption.style.display = 'none';

            }

            if ('express' in shippingPrices) {
                expressOption.style.display = 'flex';
                expressPrice.textContent = "$" + shippingPrices.express;
            } else {
                expressOption.style.display = 'none';
            }


            // Handle the response data here
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    fetchData.then(() => {
        // This code will run once the fetch request is completed
        console.log("Code to run once fetch is completed.");
        console.log(clientSecret);
        // Add your additional code here.
        initialize();
    });





    // ============================================================================
    // Initialize Stripe Elements
    // ============================================================================

    async function initialize() {




        var paymentValue;

        document.addEventListener("submit", handleSubmit);

        // Options for initializing Stripe elements
        const options = {
            clientSecret,
            loader: "auto",
            emailRequired: true,
            appearance: {
                theme: "stripe",
                rules: {},
            },
            paymentMethodCreation: 'manual',

        };
        elements = stripe.elements(options);
        //var expressElement = stripe.elements(options);

        // Create and mount Express Checkout and Link Authentication elements
        const linkAuthenticationElement = elements.create("linkAuthentication");
        const expressCheckoutElement = elements.create("expressCheckout");
        linkAuthenticationElement.mount("#link-authentication-element");

        expressCheckoutElement.mount("#express-checkout-element");


        // Create and mount payment element
        const paymentElementOptions = {
            layout: "tabs",

        };
        const paymentElement = elements.create("payment", paymentElementOptions);



        var addressElement;
        // paymentElement.mount("#payment-element");

        // Determine the address element configuration based on screen width
        const screenWidth = document.documentElement.clientWidth;
        if (screenWidth >= 0 && screenWidth <= 639) {
            addressElement = elements.create("address", {
                mode: "shipping",
                autocomplete: {
                    mode: "google_maps_api",
                    apiKey: "{YOUR_GOOGLE_MAPS_API_KEY}",
                },
                defaultValues: {
                    address: {
                        state: "NULL",
                        country: "AU",
                    },
                },
            });
        } else {
            addressElement = elements.create("address", {
                mode: "shipping",
                autocomplete: {
                    mode: "google_maps_api",
                    apiKey: "{YOUR_GOOGLE_MAPS_API_KEY}",
                },
            });
        }
        addressElement.mount("#address-element");


        var eventValue;


        var linkAuthChange = false;
        var addressFilled = false;
        var address = "";
        var fieldFlags;

        // Event handler for address element change
        var displayError = document.getElementById("card-errors");


        expressCheckoutElement.on('click', (event) => {
            console.log('clicked express element 101');


            /*
            var expressCheckoutElement = elements.getElement('expressCheckout');

            expressCheckoutElement.update({
                layout: 'horizontal',
            });
            */

            (async () => {
                const response = await fetch('https://0q0j7hxr83.execute-api.ap-southeast-2.amazonaws.com/test-stage-v1/stripe/update');
                if (response.status === 'requires_payment_method') {
                    const { error } = await elements.fetchUpdates();
                }
            })();





            const options = {
                emailRequired: true
            };
            event.resolve(options);
        });







        expressCheckoutElement.on('ready', ({ availablePaymentMethods }) => {
            var expressTitle = document.getElementById('express-title');
            var expressDivider = document.getElementById('express-divider');
            var expressDiv = document.getElementById('express-checkout-element');

            if (!availablePaymentMethods) {
                // No buttons will show
                expressDiv.style.display = 'none';
                expressTitle.style.display = 'none';
                expressDivider.style.display = 'none';

            } else {

                expressDiv.style.display = 'block';
                expressTitle.style.display = 'block';
                expressDivider.style.display = 'block';

                console.log('Pheyment Methods');

                console.log(availablePaymentMethods);

            }
        });









        var stripeLoader = document.getElementById('stripe-loader');


        linkAuthenticationElement.on("ready", (event) => {
            stripeLoader.style.display = 'none';
            var contactTitle = document.getElementById('contact-title');
            contactTitle.style.display = 'block';



        });

        addressElement.on("ready", (event) => {
            stripeLoader.style.display = 'none';
            var shippingTitle = document.getElementById('shipping-title');
            shippingTitle.style.display = 'block';



        });



        //stripeLoader.style.display = 'none';

        function updateMessage() {
            if (eventValue != undefined) {


                const isNameFilled = fieldFilled(eventValue.name);
                const isCityFilled = fieldFilled(eventValue.address.city);
                const isCountryFilled = fieldFilled(eventValue.address.country);
                const isLine1Filled = fieldFilled(eventValue.address.line1);

                const isPostalCodeFilled = fieldFilled(eventValue.address.postal_code);
                const isStateFilled = fieldFilled(eventValue.address.state);

                fieldFlags = [
                    isNameFilled,
                    isCountryFilled,
                    isLine1Filled,
                    isCityFilled,
                    isStateFilled,
                    isPostalCodeFilled,
                ];


            }

        }



        const errorMessages = [
            "Enter Your Name.",
            "Enter Your Country.",
            "Enter Your Address.",
            "Enter Your Suburb/City.",
            "Enter Your State.",
            "Enter Your Postal Code.",
        ];



        function fieldFilled(value) {
            if (value === "" || value === "NULL" || value === null) {
                return false;
            }
            return true;
        }




        // =========================================================================
        // address section event listener
        // =========================================================================
        addressElement.on("change", (event) => {
            address = event.value.address;
            updateMessage();





            eventValue = event.value;
            country = eventValue.address.country;

            displayError.textContent = "";

            if (event.complete) {
                if (!emailFilled()) {
                    displayError.textContent = 'Enter Your Email.';
                } addressFilled = true;

                var payload = {
                    requestType: "updateIntent",
                    customerDetails: {
                        intentID: intentID,
                        shippingMethod: shippingMethod,
                        name: eventValue.name,
                        address: {
                            country: eventValue.address.country,
                            address1: eventValue.address.line1,
                            ...(fieldFilled(eventValue.address.line1) ? { address2: eventValue.address.line2 } : {}),
                            city: eventValue.address.city,
                            state: eventValue.address.state,
                            postalCode: eventValue.address.postal_code,
                        }
                    },
                    cart: cart.map(cartItem => {
                        const productItem = {
                            productID: cartItem.item === "For Sale Sticker" ? "forSaleSticker" : cartItem.item,
                            quantity: cartItem.quantity, // If you want to keep track of quantity, you need to modify the cart data accordingly
                        };

                        // Add phoneOption to productItem if not null or empty
                        if (cartItem.phone) {
                            productItem.phoneOption = cartItem.phone;
                        }

                        // Add emailOption to productItem if not null or empty
                        if (cartItem.email) {
                            productItem.emailOption = cartItem.email;
                        }

                        return productItem;
                    }),
                };

                var updateData = fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data.body);
                        productPrice = data.body.productPrice;
                        updateStickerPrice(productPrice);
                        //var parsedData = JSON.parse(data.body);
                        shippingPrices = data.shippingQuotes;

                        if (!('budget' in shippingPrices)) {
                            budgetOption.style.display = 'none';
                        } else {
                            budgetOption.style.display = 'flex';
                        }

                        if ('standard' in shippingPrices) {
                            standardOption.style.display = 'flex';
                            standardPrice.textContent = "$" + shippingPrices.standard;

                        } else {
                            standardOption.style.display = 'none';

                        }

                        if ('express' in shippingPrices) {
                            expressOption.style.display = 'flex';
                            expressPrice.textContent = "$" + shippingPrices.express;
                        } else {
                            expressOption.style.display = 'none';
                        }

                        (async () => {
                            const response = await fetch('/update');
                            if (response.status === 'requires_payment_method') {
                                const { error } = await elements.fetchUpdates();
                            }
                        })();




                        standardOption = document.getElementById("standard-price");
                        expressOption = document.getElementById("express-price");


                        // Handle the response data here
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });

                updateData.then(() => {
                    // This code will run once the fetch request is completed
                    console.log('updated');
                    // Add your additional code here.

                    (async () => {
                        try {
                            const response = await fetch('https://0q0j7hxr83.execute-api.ap-southeast-2.amazonaws.com/test-stage-v1/stripe/update');

                            if (response.status === 200) {
                                const data = await response.json();
                                console.log('Status:', data.status);
                                // Handle the response status as needed
                            } else {
                                console.error('Failed to update:', response.status);
                                // Handle other status codes as needed
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            // Handle the error appropriately
                        }
                    })();



                });




                checkChanges();
            } else {
                addressFilled = false;
                if (!emailFilled()) {
                    displayError.textContent = 'Enter Your Email.';
                }
                if (event.error) {
                    displayError.style.display = "block";
                    displayError.textContent = event.error.message;
                } else if (emailFilled()) {
                    for (let i = 0; i < fieldFlags.length; i++) {
                        updateMessage();
                        if (!fieldFlags[i]) {
                            displayError.style.display = "block";
                            displayError.textContent = errorMessages[i];
                            break;
                        }
                    }
                }
                checkChanges();
            }
        });



        // ==========================================================================
        // email field event listner
        // ==========================================================================
        linkAuthenticationElement.on("change", (event) => {
            emailAddress = event.value.email;
            if (event.complete) {
                linkAuthChange = true;




                var payload = {
                    requestType: "updateIntent",
                    shippingMethod: shippingMethod,
                    customerDetails: {
                        intentID: intentID,
                        email: emailAddress,
                    },
                    cart: cart.map(cartItem => {
                        const productItem = {
                            productID: cartItem.item === "For Sale Sticker" ? "forSaleSticker" : cartItem.item,
                            quantity: cartItem.quantity, // If you want to keep track of quantity, you need to modify the cart data accordingly
                        };

                        // Add phoneOption to productItem if not null or empty
                        if (cartItem.phone) {
                            productItem.phoneOption = cartItem.phone;
                        }

                        // Add emailOption to productItem if not null or empty
                        if (cartItem.email) {
                            productItem.emailOption = cartItem.email;
                        }

                        return productItem;
                    }),
                };

                var updateData = fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data.body);

                        //var parsedData = JSON.parse(data.body);
                        //console.log(parsedData);


                        // Handle the response data here
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });

                updateData.then(() => {
                    // This code will run once the fetch request is completed
                    console.log('updated emai;');
                    // Add your additional code here.
                    (async () => {
                        const response = await fetch('https://0q0j7hxr83.execute-api.ap-southeast-2.amazonaws.com/test-stage-v1/stripe/update');
                        if (response.status === 'requires_payment_method') {
                            const { error } = await elements.fetchUpdates();
                        }
                    })();

                });

                if (Array.isArray(fieldFlags)) {
                    for (let i = 0; i < fieldFlags.length; i++) {
                        updateMessage();
                        if (!fieldFlags[i]) {
                            displayError.style.display = "block";
                            displayError.textContent = errorMessages[i];
                            break;
                        }
                    }
                }


                checkChanges();
            } else {
                linkAuthChange = false;
                displayError.textContent = 'Enter Your Email.';
                checkChanges();
            }
        });

        // Function to check changes in elements and enable or disable the continue button
        function emailFilled() {

            if (linkAuthChange) {
                return true;
            } else {
                return false;
            }

        }


        function checkChanges() {
            const continueButton = document.getElementById("continue-button");
            const shippingOptions = document.querySelector(".shipping-container");
            const shippingTitle = document.getElementById("shipping-options-title");


            if (linkAuthChange && addressFilled) {
                continueButton.style.display = "block";
                shippingOptions.style.display = "flex"
                displayError.style.display = "none";
                shippingTitle.style.display = "block";
            } else {
                continueButton.style.display = "none";
                shippingOptions.style.display = "none"
                shippingTitle.style.display = "none";

            }

        }



        // ==========================================================================
        // continue button
        // ==========================================================================
        var paymentSection = document.querySelector('.payment-section');
        var paymentPage = document.querySelector('.payment');
        var paymentFilled = false;
        var currentPage = 'shipping';
        var mobileSummary = document.getElementById("mobile-order-summary");
        document.getElementById("continue-button").addEventListener("click", () => {
            const elementToRemove = document.getElementById("shipping-express");
            const paymentRemove = document.getElementById("payment-element");
            const displayHeader = document.getElementById("payment-header");
            var paymentButton = document.getElementById("submit-payment");
            var navTitle = document.querySelector('.nav-title');

            const shippingOptions = document.querySelector(".shipping-container");
            shippingOptions.style.display = "none"
            const shippingTitle = document.getElementById("shipping-options-title");
            shippingTitle.style.display = "none";
            var continueButton = document.getElementById("continue-button");
            continueButton.style.display = "none";




            // switch to payment section ===========================================
            elementToRemove.style.display = 'none';
            paymentElement.mount("#payment-element");
            paymentRemove.style.display = 'block';
            displayHeader.style.display = "block";




            if (paymentFilled) {

                paymentButton.style.display = "block";
                var screenWidth = document.documentElement.clientWidth;

                // Check if the screen width is between 360px and 639px
                if (screenWidth >= 0 && screenWidth <= 639) {
                    mobileSummary.style.display = "block";
                    setTimeout(function () {

                        paymentButton.style.opacity = 1;
                        var paymentElement = document.querySelector('.payment');
                        // Scroll to the bottom of the .payment element
                        paymentElement.scrollTop = paymentElement.scrollHeight;

                    }, 250);
                }
            } else {
                paymentButton.style.display = "none";
                mobileSummary.style.display = "none";
                var messageContainer = document.querySelector("#payment-message");
                messageContainer.classList.add("hidden");
                messageContainer.textContent = "";

            }

            // Update Nav =========================================================
            navTitle.innerHTML = `
        <span>
            <svg class="InlineSVG LinkButton-arrow" focusable="false" width="21" height="14" viewBox="0 0 21 14" fill="none" style="transform: scaleX(-1);">
                <!-- Arrow head -->
                <path d="M14.5247 0.219442C14.2317 -0.0733252 13.7568 -0.0731212 13.4641 0.219898C13.1713 0.512917 13.1715 0.98779 13.4645 1.28056L18.5 6.5L19 7L18.5 7.75C18 8.5 13.4645 12.7194 13.4645 12.7194C13.1715 13.0122 13.1713 13.4871 13.4641 13.7801C13.7568 14.0731 14.2317 14.0733 14.5247 13.7806L20.7801 7.53056C20.9209 7.38989 21 7.19902 21 7C21 6.80098 20.9209 6.61011 20.7801 6.46944L14.5247 0.219442Z" fill="#1D3944"></path>
                <path d="M14 4V1" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                <path d="M14 13V10" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                <!-- Top line -->
                <path d="M14 4L6 4" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                <!-- middle line -->
                <path d="M3 6.25C3 6.24996 3 6.58572 3 6.99993C3 7.41415 3 7.74996 3 7.75L3 6.25ZM14.0001 6.25115L3 6.25L3 7.75L13.9999 7.75115L14.0001 6.25115Z" fill="#1D3944"></path>
                <!-- bottom line -->
              <path d="M4 9.25 C12 9.25 12 9.5 12 10 V9.25ZM14 9.25H6 V10.75H14 V9.25Z" fill="#1D3944"></path>
            </svg>
        </span> Return To Shipping
    `
            /* Remove Event Listners On Nav Title */
            if (navTitle) {
                var newNavTitle = navTitle.cloneNode(true);
                navTitle.parentNode.replaceChild(newNavTitle, navTitle);
            }
            var navTitle = document.querySelector('.nav-title');
            navTitle.onclick = null;


            // =============================================================================
            // Shipping Nav Event Listener
            // =============================================================================
            navTitle.addEventListener('click', function () {
                prevPage = 'payment';
                var nav = document.querySelector('.nav');

                elementToRemove.style.display = 'block';
                shippingOptions.style.display = "flex"
                shippingTitle.style.display = "block";
                continueButton.style.display = "block";



                paymentRemove.style.display = 'none';
                displayHeader.style.display = "none";

                const paymentButton = document.getElementById("submit-payment");
                paymentButton.style.display = "none";
                var messageContainer = document.querySelector("#payment-message");
                messageContainer.classList.add("hidden");
                messageContainer.textContent = "";



                mobileSummary.style.display = "none";





                nav.style.position = 'static';
                var screenWidth = document.documentElement.clientWidth;
                if (screenWidth >= 0 && screenWidth <= 639) {
                    navTitle.innerHTML = `
            <span>
                <svg class="InlineSVG LinkButton-arrow" focusable="false" width="21" height="14" viewBox="0 0 21 14" fill="none" style="transform: scaleX(-1);">
                    <!-- Arrow head -->
                    <path d="M14.5247 0.219442C14.2317 -0.0733252 13.7568 -0.0731212 13.4641 0.219898C13.1713 0.512917 13.1715 0.98779 13.4645 1.28056L18.5 6.5L19 7L18.5 7.75C18 8.5 13.4645 12.7194 13.4645 12.7194C13.1715 13.0122 13.1713 13.4871 13.4641 13.7801C13.7568 14.0731 14.2317 14.0733 14.5247 13.7806L20.7801 7.53056C20.9209 7.38989 21 7.19902 21 7C21 6.80098 20.9209 6.61011 20.7801 6.46944L14.5247 0.219442Z" fill="#1D3944"></path>
                    <path d="M14 4V1" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                    <path d="M14 13V10" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                    <!-- Top line -->
                    <path d="M14 4L6 4" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                    <!-- middle line -->
                    <path d="M3 6.25C3 6.24996 3 6.58572 3 6.99993C3 7.41415 3 7.74996 3 7.75L3 6.25ZM14.0001 6.25115L3 6.25L3 7.75L13.9999 7.75115L14.0001 6.25115Z" fill="#1D3944"></path>
                    <!-- bottom line -->
                  <path d="M4 9.25 C12 9.25 12 9.5 12 10 V9.25ZM14 9.25H6 V10.75H14 V9.25Z" fill="#1D3944"></path>
                </svg>
            </span> Return To Cart
        `;
                } else {


                    navTitle.innerHTML = 'CarSaleStickers.com';
                    var newNavTitle = navTitle.cloneNode(true);
                    navTitle.parentNode.replaceChild(newNavTitle, navTitle);
                    navTitle.onclick = function () {
                        window.location.href = 'https://carsalestickers.com';
                    };
                }


                if (navTitle) {
                    // Remove existing event listeners
                    var newNavTitle = navTitle.cloneNode(true);
                    navTitle.parentNode.replaceChild(newNavTitle, navTitle);

                    // Add new event listener to the new element

                }



                navTitle = document.querySelector('.nav-title');
                navTitle.onclick = null;




                // =============================================================================
                // Cart Nav Event Listener
                // =============================================================================

                navTitle.addEventListener('click', function () {


                    var productSummary = document.querySelector('.product-summary');
                    var nav = document.querySelector('.nav');
                    var navTitle = document.querySelector('.nav-title');

                    productSummary.style.display = 'flex';
                    paymentSection.style.display = 'none';
                    //paymentPage.style.justifyContent = 'flex-end';
                    paymentPage.style.overflowY = 'hidden';
                    //paymentPage.style.webkitOverflowScrolling = 'auto';
                    navTitle.innerHTML = 'CarSaleStickers.com';
                    navTitle.onclick = function () {
                        window.location.href = 'https://carsalestickers.com';
                    };
                    nav.style.position = 'static';


                });




            });


            console.log('added');
        });

        function updateHTML() {
            var paymentList = document.querySelector('.payment-list');
            var subtotal = 0; // Initialize subtotal

            // Clear the existing list
            paymentList.innerHTML = '';

            // Iterate through the cart items and update the HTML
            cart.forEach(function (item) {
                var listItem = document.createElement('li');
                listItem.className = 'payment-item';

                var detailsDiv = document.createElement('div');
                detailsDiv.className = 'payment-details';

                var titleDiv = document.createElement('div');
                titleDiv.className = 'payment-title';
                titleDiv.textContent = item.item;

                detailsDiv.appendChild(titleDiv);

                if (item.phone !== null) {
                    var phoneDiv = document.createElement('div');
                    phoneDiv.className = 'payment-info';
                    phoneDiv.textContent = item.phone;
                    detailsDiv.appendChild(phoneDiv);
                }

                if (item.email !== null) {
                    var emailDiv = document.createElement('div');
                    emailDiv.className = 'payment-info';
                    emailDiv.textContent = item.email;
                    detailsDiv.appendChild(emailDiv);
                }

                var priceDiv = document.createElement('div');
                priceDiv.className = 'payment-price';
                priceDiv.textContent = '$17.00'; // You may need to calculate the price based on the cart data
                subtotal += 17; // Assuming $17 is the item price

                listItem.appendChild(detailsDiv);
                listItem.appendChild(priceDiv);

                paymentList.appendChild(listItem);
            });

            // Update the summary
            /*
            var shippingCost = 10; // Assuming $10 shipping cost
            var taxRate = 0.08; // 8% tax rate
            var tax = subtotal * taxRate;
            var total = subtotal + shippingCost + tax;

            document.querySelector('.payment-subtotal').textContent = '$' + subtotal.toFixed(2);
            document.querySelector('.payment-shipping').textContent = 'Shipping Cost: $' + shippingCost.toFixed(2);
            document.querySelector('.payment-tax').textContent = 'Tax (8%): $' + tax.toFixed(2);
            document.querySelector('.payment-total').textContent = 'Total: $' + total.toFixed(2);
            */


        }



        // =========================================================================
        // payment element evenlistener
        // =========================================================================
        paymentElement.on("change", (event) => {
            var paymentButton = document.getElementById("submit-payment");
            var mobileSummary = document.getElementById("mobile-order-summary");

            var paymentSection = document.getElementById("payment-element");
            var paymentSectionVisable = window.getComputedStyle(paymentSection).getPropertyValue('display');

            var screenWidth = document.documentElement.clientWidth;
            if (event.complete) {
                if (paymentSectionVisable !== 'none') {
                    paymentButton.style.display = "block";

                    if (screenWidth >= 0 && screenWidth <= 639) {
                        mobileSummary.style.display = "block";  // Set display to block
                    }
                }


                console.log('Cart check when reaching payment -------------');
                console.log(cart);

                paymentFilled = true;
                // Get a reference to the input element that's currently in focus (the keyboard is open)
                var inputElement = document.activeElement;

                // Hide the keyboard by removing focus from the input element
                inputElement.blur();


                // Call the updateHTML function to update the HTML

                //paymentValue = event.value;
                paymentValue = event.value;

                //updateHTML();
                updateStickerPrice(productPrice);







                // Now, focus on the #submit-payment button
                //var submitButton = document.getElementById('submit-payment');

                setTimeout(function () {
                    mobileSummary.style.opacity = 1;
                    paymentButton.style.opacity = 1;
                    var paymentElement = document.querySelector('.payment');
                    // Scroll to the bottom of the .payment element
                    paymentElement.scrollTop = paymentElement.scrollHeight;

                }, 250);




                /* mobile-order-summary */


            } else {

                // mobileSummary.style.opacity = 0; Enable if you want transition.

                setTimeout(function () {
                    mobileSummary.style.display = "none";

                }, 250);

                paymentButton.style.display = "none";
                var messageContainer = document.querySelector("#payment-message");
                messageContainer.classList.add("hidden");
                messageContainer.textContent = "";
                paymentFilled = false;
            }
        });

        expressCheckoutElement.on('confirm', async (event) => {

            /* Payment Loading Screen */
            var loadingBD = document.querySelector(".payment-backdrop");
            loadingBD.style.display = "flex";

            const { error: submitError } = await elements.submit();
            if (submitError) {
                handleError(submitError);
                return;
            }

            // Create the PaymentIntent and obtain clientSecret
            /*
            const res = await fetch('/create-intent', {
              method: 'POST',
            });
            */
            //const {client_secret: clientSecret} = await res.json();

            const { error } = await stripe.confirmPayment({
                // `elements` instance used to create the Express Checkout Element
                elements,
                // `clientSecret` from the created PaymentIntent
                clientSecret,
                confirmParams: {
                    return_url: 'https://carsalestickers.com/checkout/success/index.html?status=true',
                },
            });

            if (error) {
                // This point is only reached if there's an immediate error when
                // confirming the payment. Show the error to your customer (for example, payment details incomplete)
                handleError(error);
            } else {
                // The payment UI automatically closes with a success animation.
                // Your customer is redirected to your `return_url`.
            }



            /* Payment Logic */

            /*
            try {
                elements.submit();
                const { paymentMethod, error } = await stripe.createPaymentMethod({
                    elements,
                    params: {
                        billing_details: {
                            name: 'Jenny Rosen',
                        },
                    },
                });

                elements.getElement("payment")

                var payload = {
                    requestType: "submitPayment",
                    customerDetails: {
                        intentID: intentID,
                        paymentMethod: paymentMethod,
                        shippingMethod: shippingMethod,
                    },
                    cart: cart.map(cartItem => {
                        const productItem = {
                            productID: cartItem.item === "For Sale Sticker" ? "forSaleSticker" : cartItem.item,
                            quantity: cartItem.quantity, 
                        };
                        if (cartItem.phone) {
                            productItem.phoneOption = cartItem.phone;
                        }
                        if (cartItem.email) {
                            productItem.emailOption = cartItem.email;
                        }
                        return productItem;
                    }),
                };

                var updateData = fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('processing payment');
                        checkStatus(clientSecret);
                        console.log(' payment result: ');
                        console.log(data.body);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });

                updateData.then(() => {
                    // This code will run once the fetch request is completed
                    console.log('payment went through');
                    // Add your additional code here.
                    checkStatus(clientSecret);
                });
            }

            catch (error) {
                console.log(error);
                checkStatus(clientSecret);
            }
            */

            /* End Of Function */
        });



        async function handleSubmit(event) {
            console.log('submit btn');
            console.log(paymentValue);
            var loadingBD = document.querySelector(".payment-backdrop");
            loadingBD.style.display = "flex";

            event.preventDefault();
            // setLoading(true);

            /*
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: "http://localhost:4242/checkout.html",
                    receipt_email: emailAddress,
                },
            });
    
    
            if (error.type === "card_error" || error.type === "validation_error") {
                showMessage(error.message);
            } else {
                showMessage("An unexpected error occurred.");
            }
            // setLoading(false);
            */






            try {
                elements.submit();

                const { paymentMethod, error } = await stripe.createPaymentMethod({
                    elements,
                    params: {
                        billing_details: {
                            name: 'Jenny Rosen',
                        },
                    },
                });


                elements.getElement("payment")



                //var paymentMethod = elements.getElement("payment");




                var payload = {
                    requestType: "submitPayment",
                    customerDetails: {
                        intentID: intentID,
                        paymentMethod: paymentMethod,
                        shippingMethod: shippingMethod,

                    },
                    cart: cart.map(cartItem => {
                        const productItem = {
                            productID: cartItem.item === "For Sale Sticker" ? "forSaleSticker" : cartItem.item,
                            quantity: cartItem.quantity, // If you want to keep track of quantity, you need to modify the cart data accordingly
                        };

                        // Add phoneOption to productItem if not null or empty
                        if (cartItem.phone) {
                            productItem.phoneOption = cartItem.phone;
                        }

                        // Add emailOption to productItem if not null or empty
                        if (cartItem.email) {
                            productItem.emailOption = cartItem.email;
                        }

                        return productItem;
                    }),
                };





                var updateData = fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('processing payment');
                        checkStatus(clientSecret);
                        console.log(' payment result: ');
                        console.log(data.body);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });

                updateData.then(() => {
                    // This code will run once the fetch request is completed
                    console.log('payment went through');
                    // Add your additional code here.
                    checkStatus(clientSecret);


                });

            }

            catch (error) {
                console.log(error);
                checkStatus(clientSecret);
            }

        }






    }





    // =============================================================================
    // Check Payment Status
    // =============================================================================

    async function checkStatus(clientSecret) {
        var loadingBD = document.querySelector(".payment-backdrop");
        /*
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        */

        if (!clientSecret) {
            console.log("Nope", clientSecret);
            return;
        }
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        switch (paymentIntent.status) {
            case "succeeded":
                showMessage("Payment succeeded!");
                window.location.href = "/checkout/success/index.html?status=true";
                break;
            case "processing":
                showMessage("Your payment is processing.");


                break;
            case "requires_payment_method":
                showMessage("Your payment was not successful, please try again.");
                loadingBD.style.display = "none";
                break;
            default:
                showMessage("Something went wrong.");
                loadingBD.style.display = "none";
                break;
        }
    }


    // =============================================================================
    // Show Message and Set Loading State
    // =============================================================================

    function showMessage(messageText) {
        const messageContainer = document.querySelector("#payment-message");
        messageContainer.classList.remove("hidden");
        messageContainer.textContent = messageText;
        /*
        setTimeout(function () {
            messageContainer.classList.add("hidden");
            messageContainer.textContent = "";
        }, 4000);
        */


    }

    // Fix the current function, setLoading currently not functional. 
    function setLoading(isLoading) {
        if (isLoading) {
            document.querySelector("#submit").disabled = true;
            document.querySelector("#spinner").classList.remove("hidden");
            document.querySelector("#button-text").classList.add("hidden");
        } else {
            document.querySelector("#submit").disabled = false;
            document.querySelector("#spinner").classList.add("hidden");
            document.querySelector("#button-text").classList.remove("hidden");
        }
    }


    // ============================================================================
    // Confirm Payment
    // ============================================================================
    // JavaScript to handle the responsive behavior
    const mobileHiddenElements = document.querySelectorAll(".mobile-hidden");

    // Store the original display value of each element
    mobileHiddenElements.forEach(function (element) {
        element.dataset.originalDisplay = getComputedStyle(element).display;
    });



    function setMobileHiddenDisplay() {
        const screenWidth = document.documentElement.clientWidth;

        // Check if the screen width is between 360px and 639px
        if (screenWidth >= 0 && screenWidth <= 639) {
            // Set the display property of elements with .mobile-hidden to 'none'
            mobileHiddenElements.forEach(function (element) {
                element.style.display = "none";
            });

            // Restore the original display property
            mobileHiddenElements.forEach(function (element) {
                element.style.display = element.dataset.originalDisplay;
            });
        }
    }

    // Add an event listener for window resize
    window.addEventListener("resize", setMobileHiddenDisplay);

    // Run the event listener on page load
    setMobileHiddenDisplay();


});