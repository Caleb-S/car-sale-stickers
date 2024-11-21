const ENV = 'test';
const URL = "https://api.carsalestickers.com/stripe";

let clientSecret;
var intentID;

let country;
let elements;

var shippingMethod = 'budget'; // Default Shipping Method

// Turn logger on / off
let logger = false;
if (ENV === 'test') {
    logger = true;
}

// Get shipping prices if already inclised in cookie
let shippingPrices = getCookie("shippingPrices");
if (shippingPrices === null) {
    shippingPrices;
}
logger ? console.log(shippingPrices) : null;


console.log('21/11/2024 update');

// =============================================================================/n
// Main Logic
// =============================================================================
document.addEventListener("DOMContentLoaded", async () => {
    // Important Variabels =====================================================
    const ENVK1 = 'pk_'
    const ENVK2 = '_51NWg86IA9Fl1A3IG';
    const ENVK3 = 'TsyLEeLB83hHQu0kIH8OFZipQP1BAklKyzEOnzNmrjDHyt7eRKYgeZcBwI45Bzxn60Z6icUg009NOrOYZq';
    const ENVK4 = 'SFDEFKCXrgnPzKrByAV4rpAkmzEctARO9oSgnHHIzjLYtw5k5ShVqQjvhwQ3Ypbr2Ztl9c6W008TAobYhd';

    // General Variiables ======================================================
    let emailAddress = "";

    // =============================================================================
    // Initialization Section
    // =============================================================================
    let stripe;
    if (ENV === 'test') {
        stripe = Stripe(ENVK1 + ENV + ENVK2 + ENVK3);

        if (logger) {
            let commentLine = "=============================================";
            console.log(`\n${commentLine}\nTest Environment - Payments won't be charged.\n${commentLine}`);
            console.log(ENVK1 + ENV + ENVK2 + ENVK3);
        }   
    } else if (ENV === 'live') {
        stripe = Stripe(ENVK1 + ENV + ENVK2 + ENVK4);
    }


    // =============================================================================
    // Create Payment Intent
    // =============================================================================
    let payload = {
        requestType: "paymentIntent",
        customerDetails: {
            ipAddress: await fetchUserIP(),
        },
        cart: cart.map(cartItem => {
             let productItem = {
                productID: cartItem.item === "For Sale Sticker" ? "forSaleSticker" : cartItem.item,
                quantity: cartItem.quantity,
                ...(cartItem.phone && { phoneOption: cartItem.phone }),
                ...(cartItem.email && { emailOption: cartItem.email }),
            };

            return productItem;
        }),
    };

    let fetchData = fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    .then((response) => response.json())
    .then((data) => {
        let parsedData = JSON.parse(data.body);
        clientSecret = parsedData.clientSecret;
        intentID = parsedData.intentID;

        if (shippingPrices === undefined) {
            shippingPrices = data.shippingQuotes;
            logger ? console.log("Setting: " + shippingPrices) : null;
        } else if ((data.shippingQuotes !== shippingPrices) && data.shippingQuotes) {
            shippingPrices = data.shippingQuotes;
            logger ? console.log("changing: " + shippingPrices) : null;
        }

        visableShippingOptions();

    })
    .catch((error) => {
        logger ? console.error("Error:", error) : null;
    });

    fetchData.then(() => {
        initialize();
    });

    // ============================================================================
    // Initialize Stripe Elements
    // ============================================================================

    async function initialize() {
        let paymentValue;

        document.addEventListener("submit", handleSubmit);

        // Options for initializing Stripe elements
        let options = {
            clientSecret,
            loader: "auto",
            emailRequired: true,
            shippingAddressRequired: true,
            appearance: {
                theme: "stripe",
                rules: {},
            },
            paymentMethodCreation: 'manual',

        };
        elements = stripe.elements(options);

        // Create and mount Express Checkout and Link Authentication elements
        let linkAuthenticationElement = elements.create("linkAuthentication");
        let expressCheckoutElement = elements.create("expressCheckout");
        // Mount elements
        linkAuthenticationElement.mount("#link-authentication-element");
        expressCheckoutElement.mount("#express-checkout-element");


        // Create and mount payment element
        let paymentElementOptions = {
            layout: "tabs",
        };
        let paymentElement = elements.create("payment", paymentElementOptions);
        let addressElement;
        // paymentElement.mount("#payment-element");

        // Determine the address element configuration based on screen width
        let screenWidth = document.documentElement.clientWidth;
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


        let eventValue;


        let linkAuthChange = false;
        let addressFilled = false;
        let address = "";
        let fieldFlags;

        // Event handler for address element change
        let displayError = document.getElementById("card-errors");




        // Express Checkout Element
        expressCheckoutElement.on('click', (event) => {
            logger ? console.log('clicked express element 101') : null;

            let clickTime = Date.now();
            let expressDiv = document.getElementById('express-checkout-element');
            let loadingBar = document.querySelector('.loading-bar');

            expressDiv.style.display = 'none';
            loadingBar.style.display = 'flex';


            // Function to check the condition and execute code
            let checks = 0;
            (function checkConditionAndExecute(event) {
                if (!fetchingData && !pendingRequest) {
                    // hide express checkout, show loading bar 
                    let options = {
                        emailRequired: true,
                        phoneNumberRequired: true,
                        shippingAddressRequired: true,
                        shippingRates: [
                            {
                                id: 'budget',
                                amount: convertToStripePrice(shippingPrices.budget),
                                displayName: 'Free | No Tracking',
                            },
                            {
                                id: 'standard',
                                amount: convertToStripePrice(shippingPrices.standard),
                                displayName: 'Standard | Tracking',
                            },
                            {
                                id: 'express',
                                amount: convertToStripePrice(shippingPrices.express),
                                displayName: 'Express | Tracking',
                            },
                        ],
                        lineItems: [
                            {
                                name: 'For Sale Sticker - sass.caleb@icloud.com + 02108585296',
                                amount: convertToStripePrice(productPrice),
                            },
                        ],

                    };

                    if ((Date.now() - clickTime) < 1000) {
                        event.resolve(options);

                        if (logger) {
                            console.log('triggered at:');
                            console.log(Date.now() - clickTime);
                        }   
                    };


                    elements.fetchUpdates().then(() => {
                        let payload = {
                            requestType: 'saveCart',
                            customerDetails: {
                                intentID: intentID,
                                shippingMethod: shippingMethod,
                            },
                            cart: cart.map((cartItem) => {
                                let productItem = {
                                    productID: cartItem.item === 'For Sale Sticker' ? 'forSaleSticker' : cartItem.item,
                                    quantity: cartItem.quantity,
                                    ...(cartItem.phone && { phoneOption: cartItem.phone }),
                                    ...(cartItem.email && { emailOption: cartItem.email }),
                                };

                                return productItem;
                            }),
                        };

                        logger ? console.log(JSON.stringify(payload, null, 2)) : null;

                        // Perform the POST request
                        fetch(URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(payload),
                        });

                        // Display express checkout button again
                        expressDiv.style.display = 'block';
                        loadingBar.style.display = 'none';
                    });

                } else {
                    // If the condition is still false, check again after a delay
                    if (checks <= 10) {
                        checks += 1;
                        logger ? console.log('Checking(0.1s): ' + checks) : null;
                        setTimeout(() => checkConditionAndExecute(event), 100);
                    } else {
                        checks += 1;
                        logger  ? console.log('Checking(2s): ' + checks) : null;
                        setTimeout(() => checkConditionAndExecute(event), 2000);
                    }
                }
            })(event);

        });



        expressCheckoutElement.on('shippingratechange', function (event) {
            let resolve = event.resolve;
            let shippingRate = event.shippingRate.id;
            // handle shippingratechange event
            console.log("ShippingRate Anwser: " + shippingRate);

            let payload = {
                requestType: "saveCart",
                customerDetails: {
                    intentID: intentID,
                    shippingMethod: shippingRate
                },
                cart: cart.map(cartItem => {
                    let productItem = {
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

            console.log(JSON.stringify(payload, null, 2));
            // Perform the POST request
            fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });


            // call event.resolve within 20 seconds
            resolve(payload);
        });






        expressCheckoutElement.on('ready', ({ availablePaymentMethods }) => {
            let expressTitle = document.getElementById('express-title');
            let expressDivider = document.getElementById('express-divider');
            let expressDiv = document.getElementById('express-checkout-element');

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




        let loadingBar = document.querySelector('.loading-bar');
        let expressDiv = document.getElementById('express-checkout-element');



        let stripeLoader = document.getElementById('stripe-loader');
        expressCheckoutElement.on("ready", (event) => {

            if (fetchingData) {
                expressDiv.style.display = 'none';
                loadingBar.style.display = 'flex';

            }


        });


        linkAuthenticationElement.on("ready", (event) => {
            stripeLoader.style.display = 'none';

            let contactTitle = document.getElementById('contact-title');
            contactTitle.style.display = 'block';



        });

        addressElement.on("ready", (event) => {
            stripeLoader.style.display = 'none';

            let shippingTitle = document.getElementById('shipping-title');
            shippingTitle.style.display = 'block';



        });



        //stripeLoader.style.display = 'none';

        function updateMessage() {
            if (eventValue != undefined) {


                let isNameFilled = fieldFilled(eventValue.name);
                let isCityFilled = fieldFilled(eventValue.address.city);
                let isCountryFilled = fieldFilled(eventValue.address.country);
                let isLine1Filled = fieldFilled(eventValue.address.line1);

                let isPostalCodeFilled = fieldFilled(eventValue.address.postal_code);
                let isStateFilled = fieldFilled(eventValue.address.state);

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

                let payload = {
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
                        let productItem = {
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

                let updateData = fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        elements.fetchUpdates();
                        if (productPrice === undefined) {
                            productPrice = data.body.productPrice;
                        } else if ((data.body.productPrice !== productPrice) && data.body.productPrice) {
                            productPrice = data.body.productPrice;
                        }
                        updateStickerPrice(productPrice);

                        if (shippingPrices === undefined) {
                            console.log(shippingPrices);
                            shippingPrices = data.shippingQuotes;
                            console.log("setting: " + shippingPrices);
                        } else if ((data.shippingQuotes !== shippingPrices) && data.shippingQuotes) {
                            console.log(shippingPrices);
                            shippingPrices = data.shippingQuotes;
                            console.log("changing: " + shippingPrices);
                        }


                        visableShippingOptions();





                        //standardOption = document.getElementById("standard-price");
                        //expressOption = document.getElementById("express-price");


                        // Handle the response data here
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });

                updateData.then(() => {
                    // This code will run once the fetch request is completed
                    console.log('updated');
                    // Add your additional code here.

                    elements.fetchUpdates();


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




                let payload = {
                    requestType: "updateIntent",
                    shippingMethod: shippingMethod,
                    customerDetails: {
                        intentID: intentID,
                        email: emailAddress,
                    },
                    cart: cart.map(cartItem => {
                        let productItem = {
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

                let updateData = fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data.body);

                        elements.fetchUpdates();


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
            let continueButton = document.getElementById("continue-button");
            let shippingOptions = document.querySelector(".shipping-container");
            let shippingTitle = document.getElementById("shipping-options-title");


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
        let paymentSection = document.querySelector('.payment-section');
        let paymentPage = document.querySelector('.payment');
        let paymentFilled = false;
        let currentPage = 'shipping';
        let mobileSummary = document.getElementById("mobile-order-summary");
        document.getElementById("continue-button").addEventListener("click", () => {
            let elementToRemove = document.getElementById("shipping-express");
            let paymentRemove = document.getElementById("payment-element");
            let displayHeader = document.getElementById("payment-header");
            let paymentButton = document.getElementById("submit-payment");
            let navTitle = document.querySelector('.nav-title');

            let shippingOptions = document.querySelector(".shipping-container");
            shippingOptions.style.display = "none"
            let shippingTitle = document.getElementById("shipping-options-title");
            shippingTitle.style.display = "none";
            let continueButton = document.getElementById("continue-button");
            continueButton.style.display = "none";




            // switch to payment section ===========================================
            elementToRemove.style.display = 'none';
            paymentElement.mount("#payment-element");
            paymentRemove.style.display = 'block';
            displayHeader.style.display = "block";




            if (paymentFilled) {

                paymentButton.style.display = "block";
                let screenWidth = document.documentElement.clientWidth;

                // Check if the screen width is between 360px and 639px
                if (screenWidth >= 0 && screenWidth <= 639) {
                    mobileSummary.style.display = "block";
                    paymentButton.style.opacity = 1;
                    setTimeout(function () {

                        paymentButton.style.opacity = 1;
                        let paymentElement = document.querySelector('.payment');
                        // Scroll to the bottom of the .payment element
                        paymentElement.scrollTop = paymentElement.scrollHeight;

                    }, 250);
                }
            } else {
                paymentButton.style.display = "none";
                mobileSummary.style.display = "none";
                let messageContainer = document.querySelector("#payment-message");
                messageContainer.classList.add("hidden");
                messageContainer.textContent = "";

            }

            // Update Nav =========================================================
            navTitle.innerHTML = `
                <span>
                    <svg class="InlineSVG LinkButton-arrow" focusable="false" width="21" height="14" viewBox="0 0 21 14" fill="none" style="transform: scaleX(-1);">
                        <path d="M14.5247 0.219442C14.2317 -0.0733252 13.7568 -0.0731212 13.4641 0.219898C13.1713 0.512917 13.1715 0.98779 13.4645 1.28056L18.5 6.5L19 7L18.5 7.75C18 8.5 13.4645 12.7194 13.4645 12.7194C13.1715 13.0122 13.1713 13.4871 13.4641 13.7801C13.7568 14.0731 14.2317 14.0733 14.5247 13.7806L20.7801 7.53056C20.9209 7.38989 21 7.19902 21 7C21 6.80098 20.9209 6.61011 20.7801 6.46944L14.5247 0.219442Z" fill="#1D3944"></path>
                        <path d="M14 4V1" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                        <path d="M14 13V10" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                        <path d="M14 4L6 4" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                        <path d="M3 6.25C3 6.24996 3 6.58572 3 6.99993C3 7.41415 3 7.74996 3 7.75L3 6.25ZM14.0001 6.25115L3 6.25L3 7.75L13.9999 7.75115L14.0001 6.25115Z" fill="#1D3944"></path>
                        <path d="M4 9.25 C12 9.25 12 9.5 12 10 V9.25ZM14 9.25H6 V10.75H14 V9.25Z" fill="#1D3944"></path>
                    </svg>
                </span> Return To Shipping
            `;
            /* Remove Event Listners On Nav Title */
            if (navTitle) {
                let newNavTitle = navTitle.cloneNode(true);
                navTitle.parentNode.replaceChild(newNavTitle, navTitle);
            }
            navTitle = document.querySelector('.nav-title');
            navTitle.onclick = null;


            // =============================================================================
            // Shipping Nav Event Listener
            // =============================================================================
            navTitle.addEventListener('click', function () {
                prevPage = 'payment';
                let nav = document.querySelector('.nav');

                elementToRemove.style.display = 'block';
                shippingOptions.style.display = "flex"
                shippingTitle.style.display = "block";
                continueButton.style.display = "block";



                paymentRemove.style.display = 'none';
                displayHeader.style.display = "none";

                let paymentButton = document.getElementById("submit-payment");
                paymentButton.style.display = "none";
                let messageContainer = document.querySelector("#payment-message");
                messageContainer.classList.add("hidden");
                messageContainer.textContent = "";



                mobileSummary.style.display = "none";





                nav.style.position = 'static';
                let screenWidth = document.documentElement.clientWidth;
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
                    let newNavTitle = navTitle.cloneNode(true);
                    navTitle.parentNode.replaceChild(newNavTitle, navTitle);
                    navTitle.onclick = function () {
                        window.location.href = 'https://carsalestickers.com';
                    };
                }


                if (navTitle) {
                    // Remove existing event listeners
                    let newNavTitle = navTitle.cloneNode(true);
                    navTitle.parentNode.replaceChild(newNavTitle, navTitle);

                    // Add new event listener to the new element

                }



                navTitle = document.querySelector('.nav-title');
                navTitle.onclick = null;




                // =============================================================================
                // Cart Nav Event Listener
                // =============================================================================

                navTitle.addEventListener('click', function () {


                    let productSummary = document.querySelector('.product-summary');
                    let nav = document.querySelector('.nav');
                    let navTitle = document.querySelector('.nav-title');

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
            let paymentList = document.querySelector('.payment-list');
            let subtotal = 0; // Initialize subtotal

            // Clear the existing list
            paymentList.innerHTML = '';

            // Iterate through the cart items and update the HTML
            cart.forEach(function (item) {
                let listItem = document.createElement('li');
                listItem.className = 'payment-item';

                let detailsDiv = document.createElement('div');
                detailsDiv.className = 'payment-details';

                let titleDiv = document.createElement('div');
                titleDiv.className = 'payment-title';
                titleDiv.textContent = item.item;

                detailsDiv.appendChild(titleDiv);

                if (item.phone !== null) {
                    let phoneDiv = document.createElement('div');
                    phoneDiv.className = 'payment-info';
                    phoneDiv.textContent = item.phone;
                    detailsDiv.appendChild(phoneDiv);
                }

                if (item.email !== null) {
                    let emailDiv = document.createElement('div');
                    emailDiv.className = 'payment-info';
                    emailDiv.textContent = item.email;
                    detailsDiv.appendChild(emailDiv);
                }

                let priceDiv = document.createElement('div');
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
            let paymentButton = document.getElementById("submit-payment");
            let mobileSummary = document.getElementById("mobile-order-summary");

            let paymentSection = document.getElementById("payment-element");
            let paymentSectionVisable = window.getComputedStyle(paymentSection).getPropertyValue('display');

            let screenWidth = document.documentElement.clientWidth;
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
                let inputElement = document.activeElement;

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
                    let paymentElement = document.querySelector('.payment');
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
                let messageContainer = document.querySelector("#payment-message");
                messageContainer.classList.add("hidden");
                messageContainer.textContent = "";
                paymentFilled = false;
            }
        });

        expressCheckoutElement.on('confirm', async (event) => {
            pintrk('track', 'checkout', {
                event_id: 'eventPayment002',
                value: cartValue,
                order_quantity: itemQuantity,
                currency: 'USD'
            });

            /* Payment Loading Screen */
            let loadingBD = document.querySelector(".payment-backdrop");
            loadingBD.style.display = "flex";

            let { error: submitError } = await elements.submit();
            if (submitError) {
                handleError(submitError);
                return;
            }

            let { error } = await stripe.confirmPayment({
                // `elements` instance used to create the Express Checkout Element
                elements,
                // `clientSecret` from the created PaymentIntent
                clientSecret,
                confirmParams: {
                    return_url: 'https://carsalestickers.com/checkout/success/index.html?status=true',
                },
            });

            if (logger) {
                error ? handleError(error) : null;
            }


        async function handleSubmit(event) {
            console.log('submit btn');
            console.log(paymentValue);
            let loadingBD = document.querySelector(".payment-backdrop");
            loadingBD.style.display = "flex";

            event.preventDefault();

            try {
                elements.submit();

                let { paymentMethod, error } = await stripe.createPaymentMethod({
                    elements,
                    params: {
                        billing_details: {
                            name: 'Jenny Rosen',
                        },
                    },
                });


                elements.getElement("payment")

                let payload = {
                    requestType: "submitPayment",
                    customerDetails: {
                        intentID: intentID,
                        paymentMethod: paymentMethod,
                        shippingMethod: shippingMethod,

                    },
                    cart: cart.map(cartItem => {
                        let productItem = {
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
                    stickerType: stickerType,
                };

                let updateData = fetch(URL, {
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
                    /* pinterest */

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
        let loadingBD = document.querySelector(".payment-backdrop");
        /*
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        */

        if (!clientSecret) {
            console.log("Nope", clientSecret);
            return;
        }
        let { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        switch (paymentIntent.status) {
            case "succeeded":
                pintrk('track', 'checkout', {
                    event_id: 'eventPayment001',
                    value: cartValue,
                    order_quantity: itemQuantity,
                    currency: 'USD'
                });

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
        let messageContainer = document.querySelector("#payment-message");
        messageContainer.classList.remove("hidden");
        messageContainer.textContent = messageText;
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
    let mobileHiddenElements = document.querySelectorAll(".mobile-hidden");

    // Store the original display value of each element
    mobileHiddenElements.forEach(function (element) {
        element.dataset.originalDisplay = getComputedStyle(element).display;
    });



    function setMobileHiddenDisplay() {
        let screenWidth = document.documentElement.clientWidth;

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


// =============================================================================
// Helper Functions
// =============================================================================
function convertToStripePrice(normalAmount) {
    let stripeAmount = Math.round(normalAmount * 100);
    return stripeAmount;
}


async function fetchUserIP() {
    if (!ipaddr) {
        try {
            let response = await fetch("https://api.bigdatacloud.net/data/client-ip");
            let data = await response.json();
            ipaddr = data.ipString;
            return data.ipString;
        } catch (error) {
            return null;
        }
    } else {
        return ipaddr;
    }

}

function visableShippingOptions() {
    let budgetOption = document.getElementById("budget");
    let standardOption = document.getElementById("standard");
    let expressOption = document.getElementById("express");
    let standardPrice = document.getElementById("standard-price");
    let expressPrice = document.getElementById("express-price");

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

}


