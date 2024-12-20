var ipaddr; // GLOBAL
var cart = []; // GLOBAL
var env = 'live'; // GLOBAL
var shippingMethod; // GLOBAL


var logger = false;
if (env === 'test') {
    logger = true;
}


// Function to get cookie value by name
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

// Get productPrice from cookie
var productPrice = getCookie("productPrice"); // GLOBAL
var cartValue; // GLOBAL

// If productPrice cookie is not set, default it to 24.99
if (productPrice === null) {
    productPrice = 0.00;
} else {
    cartValue = productPrice;
}

// Now, productPrice contains the desired value
logger && console.log("Product Price:", productPrice);

var pendingRequest = false; // GLOBAL
var fetchingData = false; // GLOBAL
var stickerType; // GLOBAL
// var itemQuantity = 1; // GLOBAL

getPrice();

// =============================================================================
// This event handler runs when the DOM content is fully loaded.
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    initOrderSummary();


    policiesPopup();
    updateCart();
    let checkInterval = setInterval(checkAndUpdateIntent, 1000);

    window.addEventListener('resize', handleScreenWidthChange);
    document.querySelector(".action-section").addEventListener("click", function (event) {
        if (event.target.classList.contains("toPayment-btn")) {
            // Shipping & Payment Btn (Mobile Only)
            handleToPaymentButtonClick(event);
        } else if (event.target.classList.contains("variant-btn")) {
            // Add Sticker Btn
            handleVariantButtonClick(event);
        }
    });

    function checkAndUpdateIntent() {
        if (typeof intentID !== 'undefined' && intentID !== null) {

            updateIntent();
            clearInterval(checkInterval); // Clear the interval once updated
        }
    }

});



function initOrderSummary() {
    let cartDetails = getParams();
    let actionSection = document.querySelector(".action-section");
    actionSection.parentNode.insertBefore(createOptionWrapperElement(), actionSection);

    let builderContainer = document.querySelector(".builder-container");
    let forSaleTxt = builderContainer.querySelector('.sticker-for-sale-sum');

    cartDetails.numShow && showMobileNumber();
    cartDetails.mailShow && showEmail();


    function showMobileNumber() {
        let mobileText = builderContainer.querySelector('#sticker-num');
        let mobileButton = builderContainer.querySelector('#mobile-btn');
        let mobileImage = mobileButton.querySelector('img');

        mobileText.style.display = 'block';
        mobileText.value = cartDetails.numTextParam;
        resizeInput(forSaleTxt, mobileText, 'phone');
        handleFocusOut.call(mobileText);

        mobileImage.setAttribute("src", "/src/assets/del-btn.svg");
    }

    function showEmail() {
        let mailText = builderContainer.querySelector('#sticker-mail');
        let mailButton = builderContainer.querySelector('#email-btn');
        let mailImage = mailButton.querySelector('img');

        mailText.style.display = 'block';
        mailText.value = cartDetails.mailTextParam;
        resizeInput(forSaleTxt, mailText, 'email');
        handleFocusOut.call(mailText);

        mailImage.setAttribute("src", "/src/assets/del-btn.svg");
    }

    function getParams() {
        let params = new URLSearchParams(window.location.search);

        let quantity = parseInt(params.get("quantity"));
        let numShow = params.get("sticker-num");
        let mailShow = params.get("sticker-mail");
        let numTextParam = params.get("num-text") ? params.get("num-text") : null;
        let mailTextParam = params.get("mail-text") ? params.get("mail-text") : null;

        if (quantity !== 1) {
            numShow = "hide";
            mailShow = "hide";
        }

        return {
            quantity: parseInt(quantity),
            numShow: (numShow === "show"),
            mailShow: (mailShow === "show"),
            numTextParam: numTextParam,
            mailTextParam: mailTextParam
        };
    }

    (function clearCurrentUrlParams() {
        let currentUrl = window.location.href;
        if (currentUrl.indexOf('?') !== -1) {
            let parts = currentUrl.split('?');
            let baseUrl = parts[0];
            let newUrl = baseUrl;
            window.history.replaceState({}, document.title, newUrl.replace(/\/index\.html$/, ''));
        }
    })();

    (function hideDivider() {
        let parent = builderContainer.parentNode;
        let builderContainersInParent = parent.querySelectorAll('.builder-container');
        let divider = builderContainersInParent[0].querySelector(".divider");
        divider.style.display = 'none';
    })();
}




function updateCart() {

    cart = [];
    // Query all .builder-container elements
    const builderContainers = document.querySelectorAll('.builder-container');

    builderContainers.forEach((container) => {
        // Check if .sticker-border-sum exists in this container
        const stickerBorderSum = container.querySelector('.sticker-border-sum');

        if (stickerBorderSum) {
            const numInput = stickerBorderSum.querySelector('.num-input');
            const mailInput = stickerBorderSum.querySelector('.mail-input');
            const stickerQuantity = container.querySelector('.quantity-num');


            // Check if .num-input and .mail-input have display none
            const numDisplay = getComputedStyle(numInput).getPropertyValue('display');
            const mailDisplay = getComputedStyle(mailInput).getPropertyValue('display');


            const item = "For Sale Sticker";
            const phone = numDisplay !== 'none' ? numInput.value : null;
            const email = mailDisplay !== 'none' ? mailInput.value : null;
            const quantity = parseInt(stickerQuantity.textContent);
            // console.log('quantitiy: ', quantity);

            // Add the item to the cart
            if (quantity > 0) {
                cart.push({ item, phone, email, quantity });
            }


        }
    });


    updateStickerPrice();
    updateIntent();


    console.log(cart);
}





// =============================================================================
// It switches between product and payment views during screen width change.
// =============================================================================
function handleScreenWidthChange() {
    const screenWidth = document.documentElement.clientWidth;
    var paymentSection = document.querySelector('.payment-section');
    var paymentPage = document.querySelector('.payment');
    var productSummary = document.querySelector('.product-summary');
    var nav = document.querySelector('.nav');
    var navTitle = document.querySelector('.nav-title');
    var sumDeco = document.querySelector('.summary-deco');
    var productDisplayValue = window.getComputedStyle(productSummary).getPropertyValue('display');
    var paymentDisplayValue = window.getComputedStyle(paymentSection).getPropertyValue('display');
    var paymentElement = document.getElementById("payment-element");
    var shippingElement = document.getElementById("shipping-express");

    var paymentValue = window.getComputedStyle(paymentElement).getPropertyValue('display');
    var shippingValue = window.getComputedStyle(shippingElement).getPropertyValue('display');
    var checkoutStage;


    var mobileSum = document.getElementById("mobile-order-summary");




    console.log('mobile view | ' + "mobileview: " + mobileView + ' | ' + lastView + ' | payment: ' + paymentDisplayValue + ' | product: ' + productDisplayValue);
    if (!(screenWidth >= 0 && screenWidth <= 639)) {
        console.log('desktop view | ' + "mobileview: " + mobileView + ' | ' + lastView + ' | payment: ' + paymentDisplayValue + ' | product: ' + productDisplayValue);
        mobileView = false;
        sumDeco.style.display = 'block';

        productSummary.style.display = 'flex';
        paymentSection.style.display = 'flex';
        paymentSection.style.paddingLeft = '30px';
        //paymentSection.style.justifyContent = 'center';
        paymentPage.style.justifyContent = 'flex-end';
        paymentSection.style.justifyContent = 'flex-start';
        //paymentPage.style.justifyContent = 'flex-end';
        paymentPage.style.overflowY = 'hidden';
        //paymentPage.style.webkitOverflowScrolling = 'auto';

        mobileSum.style.display = 'none';

        if (lastView != 'payment') {
            navTitle.innerHTML = 'CarSaleStickers.com';
            navTitle.onclick = function () {
                window.location.href = 'index.html';
            };
        } else {
            navTitle.onclick = null;

            navTitle.innerHTML = `
                <span>
                    <svg class="InlineSVG LinkButton-arrow" focusable="false" width="21" height="14" viewBox="0 0 21 14" fill="none" style="transform: scaleX(-1);">
                        <!-- Arrow head -->
                        <path d="M14.5247 0.219442C14.2317 -0.0733252 13.7568 -0.0731212 13.4641 0.219898C13.1713 0.512917 13.1715 0.98779 13.4645 1.28056L18.5 6.5L19 7L18.5 7.75C18 8.5 13.4645 12.7194 13.4645 12.7194C13.1715 13.0122 13.1713 13.4871 13.4641 13.7801C13.7568 14.0731 14.2317 14.0733 14.5247 13.7806L20.7801 7.53056C20.9209 7.38989 21 7.19902 21 7C21 6.80098 20.9209 6.61011 20.7801 6.46944L14.5247 0.219442Z" fill="#1D3944"></path>
                        <path d="M14 lastview4V1" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                        <path d="M14 13V10" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                        <!-- Top line -->
                        <path d="M14 4L6 4" stroke="#1D3944" stroke-width="1.5" stroke-linecap="round"></path>
                        <!-- middle line -->
                        <path d="M3 6.25C3 6.24996 3 6.58572 3 6.99993C3 7.41415 3 7.74996 3 7.75L3 6.25ZM14.0001 6.25115L3 6.25L3 7.75L13.9999 7.75115L14.0001 6.25115Z" fill="#1D3944"></path>
                        <!-- bottom line -->
                      <path d="M4 9.25 C12 9.25 12 9.5 12 10 V9.25ZM14 9.25H6 V10.75H14 V9.25Z" fill="#1D3944"></path>
                    </svg>
                </span> Return To Shipping
            `;
        }

        nav.style.position = 'static';
    } else if ((!mobileView || mobileView === undefined) && lastView === 'product') {
        console.log('mobile view | ' + "mobileview: " + mobileView + ' | ' + lastView + ' | payment: ' + paymentDisplayValue + ' | product: ' + productDisplayValue);
        mobileView = true;
        navTitle.innerHTML = 'CarSaleStickers.com';
        navTitle.onclick = function () {
            window.location.href = 'index.html';
        };
        productSummary.style.display = 'flex';
        paymentSection.style.display = 'none';
        paymentSection.style.paddingLeft = '0px';
        paymentSection.style.justifyContent = 'center';
        paymentPage.style.justifyContent = 'center';
        paymentPage.style.overflowY = 'auto';
        //paymentPage.style.webkitOverflowScrolling = 'touch';
        navTitle.onclick = null;
    } else if ((!mobileView || mobileView === undefined) && (lastView === 'payment' || lastView === 'shipping')) {
        console.log('mobile view | ' + "mobileview: " + mobileView + ' | ' + lastView + ' | payment: ' + paymentDisplayValue + ' | product: ' + productDisplayValue);
        mobileView = true;
        productSummary.style.display = 'none';
        paymentSection.style.display = 'flex';
        paymentSection.style.paddingLeft = '0px';
        paymentSection.style.justifyContent = 'center';
        paymentPage.style.justifyContent = 'center';
        paymentPage.style.overflowY = 'auto';
        // paymentPage.style.webkitOverflowScrolling = 'touch';

        if (document.getElementById('submit-payment').style.display !== 'none') {
            mobileSum.style.display = 'block';
        } else {
            mobileSum.style.display = 'none';
        }


        navTitle.onclick = null;
        if (lastView === 'payment') {
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
            `;
        } else if (lastView === 'shipping') {
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
        }

    }

    if (screenWidth >= 0 && screenWidth <= 639) {
        if (productDisplayValue !== 'none') {

            lastView = 'product';
        } else if (paymentDisplayValue !== 'none' && paymentValue !== 'none') {

            lastView = 'payment';
        } else if (paymentDisplayValue !== 'none' && shippingValue !== 'none') {
            lastView = 'shipping';
        }
    } else {
        if (paymentValue !== 'none') {
            lastView = 'payment';
        } else if (lastView != 'shipping') {
            lastView = 'product';
        }
    }

}

// =============================================================================
// Handle the click event for the "To Payment" button
// =============================================================================
function handleToPaymentButtonClick(event) {
    var paymentSection = document.querySelector('.payment-section');
    var paymentPage = document.querySelector('.payment');
    var productSummary = document.querySelector('.product-summary');
    var nav = document.querySelector('.nav');
    var navTitle = document.querySelector('.nav-title');
    productSummary.style.display = 'none';
    paymentSection.style.display = 'flex';
    paymentSection.style.paddingLeft = '0px';
    paymentSection.style.justifyContent = 'center';
    paymentPage.style.justifyContent = 'center';
    paymentPage.style.overflowY = 'auto';
    //paymentPage.style.webkitOverflowScrolling = 'touch';
    navTitle.onclick = null;
    //lastView = 'shipping';

    // Get all the click event listeners attached to the element

    // Loop through and remove all click event listeners
    const paymentHeader = document.getElementById("payment-header");
    var elementToRemove = document.getElementById("shipping-express");
    elementToRemove.style.display = 'block';
    var paymentRemove = document.getElementById("payment-element");
    paymentRemove.style.display = 'none';
    paymentHeader.style.display = 'none';

    var submitBtn = document.getElementById("submit-payment");
    submitBtn.style.display = 'none';



    if (navTitle) {
        // Remove existing event listeners
        var newNavTitle = navTitle.cloneNode(true);
        navTitle.parentNode.replaceChild(newNavTitle, navTitle);


    }

    var navTitle = document.querySelector('.nav-title');
    navTitle.onclick = null;
    navTitle.addEventListener('click', navClickHandler);

    function navClickHandler(event) {
        console.log('old event listner');
        var paymentSection = document.querySelector('.payment-section');
        var paymentPage = document.querySelector('.payment');
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
            window.location.href = 'index.html';
        };
        nav.style.position = 'static';
    }
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
    }
}

// =============================================================================
// Handles click events for adding new variants/options to the sticker.
// =============================================================================
function handleVariantButtonClick(event) {
    let newOptionWrapper = createOptionWrapperElement();
    let actionSection = document.querySelector(".action-section");

    actionSection.parentNode.insertBefore(newOptionWrapper, actionSection);
    // Move scroll to new variant 
    setTimeout(function (newOptionWrapper) {
        newOptionWrapper.scrollIntoView({ behavior: "smooth" });
    }, 200, newOptionWrapper);

    let builderContainer = document.querySelector(".builder-container");
    if (builderContainer) {
        let parent = builderContainer.parentNode;
        let builderContainersInParent = parent.querySelectorAll('.builder-container');
        let divider = builderContainersInParent[0].querySelector(".divider");

        // Hide divider for first sticker
        divider.style.display = 'none';
    }

    if (logger) {
        console.log("Updating cart");
    }
    updateCart();
}



// =============================================================================
// Creates a new option wrapper element in the document.
// =============================================================================
function createOptionWrapperElement() {
    const builderContainer = document.createElement("div");
    builderContainer.classList.add("builder-container");
    const divider = document.createElement("div");
    divider.classList.add("divider");
    divider.classList.add("divider-custom");
    builderContainer.appendChild(divider);

    const stickerBorder = document.createElement('div');
    stickerBorder.classList.add('sticker-border-sum');
    builderContainer.appendChild(stickerBorder);
    const forSaleTxt = document.createElement('text');
    forSaleTxt.classList.add('sticker-for-sale-sum');

    forSaleTxt.innerHTML = 'FOR<span style="font-size: 20px;"> </span>SALE';
    stickerBorder.appendChild(forSaleTxt);

    const stickerNumber = document.createElement('input');
    stickerNumber.classList.add('sticker-input');
    stickerNumber.classList.add('num-input');
    stickerNumber.setAttribute("id", "sticker-num");
    stickerNumber.setAttribute("autocomplete", "off");
    stickerNumber.setAttribute("type", "tel");
    stickerNumber.setAttribute("maxlength", "21");
    stickerNumber.addEventListener('input', function () {
        // Remove any characters that are not valid in a phone number
        stickerNumber.value = stickerNumber.value.replace(/[^0-9+()\s\-]/g, '');
    });
    stickerNumber.placeholder = '555-555-5555';
    stickerNumber.addEventListener('input', () => resizeInput(forSaleTxt, stickerNumber, 'phone'));
    stickerNumber.addEventListener('input', updateCart);
    stickerNumber.addEventListener('focus', handleFocus);
    stickerNumber.addEventListener('focus', () => resizeInput(forSaleTxt, stickerNumber, 'phone'));
    stickerNumber.addEventListener('blur', handleBlur);
    stickerNumber.addEventListener('blur', updateIntent);
    stickerNumber.addEventListener('focus', updateIntent);
    stickerNumber.addEventListener('focusin', handleFocusIn);

    stickerNumber.addEventListener('focusout', handleFocusOut);
    stickerBorder.appendChild(stickerNumber);

    stickerNumber.style.maxWidth = Math.max(stickerNumber.placeholder.length) + "ch";
    stickerNumber.style.display = 'none';

    const stickerEmail = document.createElement('input');
    stickerEmail.classList.add('sticker-input');
    stickerEmail.classList.add('mail-input');
    stickerEmail.setAttribute("id", "sticker-mail");
    stickerEmail.setAttribute("autocomplete", "off");
    stickerEmail.setAttribute("maxlength", "30");
    stickerEmail.setAttribute("type", "email");
    stickerEmail.placeholder = 'your.email@example.com';
    stickerEmail.addEventListener('input', () => resizeInput(forSaleTxt, stickerEmail, 'email'));
    stickerEmail.addEventListener('focus', handleFocus);
    stickerEmail.addEventListener('input', updateCart);

    stickerEmail.addEventListener('focus', () => resizeInput(forSaleTxt, stickerEmail, 'email'));
    stickerEmail.addEventListener('blur', handleBlur);
    stickerEmail.addEventListener('focusin', handleFocusIn);
    stickerEmail.addEventListener('focusout', handleFocusOut);
    stickerEmail.addEventListener('blur', updateIntent);
    stickerEmail.addEventListener('focus', updateIntent);
    stickerEmail.addEventListener('input', function () {
        // Remove any characters that are not valid in an email address
        stickerEmail.value = stickerEmail.value.replace(/[^a-zA-Z0-9@._-]/g, '');
    });
    resizeInput.call(stickerEmail);
    stickerBorder.appendChild(stickerEmail);
    stickerEmail.style.display = 'none';

    const optionWrapper1 = document.createElement("div");
    optionWrapper1.classList.add("option-wrapper");
    builderContainer.appendChild(optionWrapper1);

    const addBtnNum = document.createElement("div");
    addBtnNum.classList.add("add-btn-sum");
    addBtnNum.setAttribute("id", "mobile-btn");
    const addBtnNumImg = document.createElement("img");
    addBtnNumImg.setAttribute("src", "/src/assets/add-btn.svg");
    addBtnNum.appendChild(addBtnNumImg);
    optionWrapper1.appendChild(addBtnNum);
    const NumOptionText = document.createElement("text");
    NumOptionText.classList.add("sticker-option-text");
    NumOptionText.textContent = "Mobile Number";
    optionWrapper1.appendChild(NumOptionText);
    addBtnNum.addEventListener('click', () => {
        if (stickerNumber.style.display === 'none') {
            stickerNumber.style.display = 'block';
            addBtnNumImg.setAttribute("src", "/src/assets/del-btn.svg");
            stickerNumber.focus();
            updateCart();

        } else {
            stickerNumber.style.display = 'none';
            addBtnNumImg.setAttribute("src", "/src/assets/add-btn.svg");
            updateCart();

        }
    });

    NumOptionText.addEventListener('click', () => {
        if (stickerNumber.style.display === 'none') {
            stickerNumber.style.display = 'block';
            addBtnNumImg.setAttribute("src", "/src/assets/del-btn.svg");
            stickerNumber.focus();
            updateCart();

        } else {
            stickerNumber.style.display = 'none';
            addBtnNumImg.setAttribute("src", "/src/assets/add-btn.svg");
            updateCart();

        }
    });

    const optionWrapper2 = document.createElement("div");
    optionWrapper2.classList.add("option-wrapper");
    builderContainer.appendChild(optionWrapper2);
    const addBtnMail = document.createElement("div");
    addBtnMail.classList.add("add-btn-sum");
    addBtnMail.setAttribute("id", "email-btn");
    const addBtnMailImg = document.createElement("img");
    addBtnMailImg.setAttribute("src", "/src/assets/add-btn.svg");
    addBtnMail.appendChild(addBtnMailImg);
    optionWrapper2.appendChild(addBtnMail);
    const MailOptionText = document.createElement("text");
    MailOptionText.classList.add("sticker-option-text");
    MailOptionText.textContent = "Email";
    optionWrapper2.appendChild(MailOptionText);
    addBtnMail.addEventListener('click', () => {
        if (stickerEmail.style.display === 'none') {
            stickerEmail.style.display = 'block';
            addBtnMailImg.setAttribute("src", "/src/assets/del-btn.svg");
            stickerEmail.focus();
            updateCart();

        } else {
            stickerEmail.style.display = 'none';
            addBtnMailImg.setAttribute("src", "/src/assets/add-btn.svg");
            updateCart();

        }
    });

    MailOptionText.addEventListener('click', () => {
        if (stickerEmail.style.display === 'none') {
            stickerEmail.style.display = 'block';
            addBtnMailImg.setAttribute("src", "/src/assets/del-btn.svg");
            stickerEmail.focus();
            updateCart();

        } else {
            stickerEmail.style.display = 'none';
            addBtnMailImg.setAttribute("src", "/src/assets/add-btn.svg");
            updateCart();

        }
    });

    const horizontalWrapper = document.createElement("div");
    horizontalWrapper.classList.add("horizontal-wrapper");
    builderContainer.appendChild(horizontalWrapper);
    const verticalWrapper = document.createElement("div");
    verticalWrapper.classList.add("vertical-wrapper");
    horizontalWrapper.appendChild(verticalWrapper);
    const quantityTitle = document.createElement("div");
    quantityTitle.classList.add("quantity-title");
    quantityTitle.textContent = "Quantity:";
    verticalWrapper.appendChild(quantityTitle);
    const optionWrapper3 = document.createElement("div");
    optionWrapper3.classList.add("option-wrapper");
    verticalWrapper.appendChild(optionWrapper3);
    const removeBtnQuantity = document.createElement("div");
    removeBtnQuantity.classList.add('remove-btn-sum-small');
    removeBtnQuantity.setAttribute("id", "remove-item");
    optionWrapper3.appendChild(removeBtnQuantity);
    removeBtnQuantity.addEventListener("click", function (event) {
        removeBtnClickQuantity(event, quantityText);
    });
    const removeBtnQuantityImg = document.createElement("img");
    removeBtnQuantityImg.setAttribute("src", "/src/assets/del-btn.svg");
    removeBtnQuantity.appendChild(removeBtnQuantityImg);
    const quantityText = document.createElement("text");
    quantityText.classList.add("quantity-num");
    quantityText.textContent = "1";
    optionWrapper3.appendChild(quantityText);
    const addBtnQuantity = document.createElement("div");
    addBtnQuantity.classList.add('add-btn-sum-small');
    addBtnQuantity.setAttribute("id", "add-item");
    optionWrapper3.appendChild(addBtnQuantity);
    addBtnQuantity.addEventListener("click", function (event) {
        addBtnClickQuantity(event, quantityText);
    });
    const addBtnQuantityImg = document.createElement("img");
    addBtnQuantityImg.setAttribute("src", "/src/assets/add-btn.svg");
    addBtnQuantity.appendChild(addBtnQuantityImg);
    const verticalWrapper2 = document.createElement("div");
    verticalWrapper2.classList.add("vertical-wrapper");
    horizontalWrapper.appendChild(verticalWrapper2);
    const priceText = document.createElement("text");
    priceText.classList.add("price-num");
    priceText.textContent = "$" + productPrice;
    verticalWrapper2.appendChild(priceText);
    return builderContainer;


    // Handles the blur event for input fields, including placeholders and styles.
    function handleBlur() {
        if (this.value === '') {
            this.value = this.placeholder;
            this.style.color = 'rgb(136, 134, 134)';
            this.style.backgroundColor = 'rgb(25, 25, 25)';
            resizeInput.call(this);
        }
    }

    // Handles the focusin event for input fields, adjusting styles.
    function handleFocusIn() {
        this.style.backgroundColor = 'rgb(25, 25, 25)';
        console.log('input focused');
    }

    // Handles the focus event for input fields, including placeholders and styles.
    function handleFocus() {
        if (this.value === this.placeholder) {
            this.value = '';
            this.style.color = 'white';
            this.style.backgroundColor = 'rgb(25, 25, 25)';
            resizeInput.call(this);
        }
    }


    // Handles click events for decreasing quantity in the user interface.
    function removeBtnClickQuantity(event, quantityText) {
        const quantityValue = parseInt(quantityText.textContent);
        const newQuantityValue = quantityValue - 1;
        quantityText.textContent = "" + newQuantityValue;
        const builderContainer = quantityText.closest(".builder-container");
        if (builderContainer) {
            const parent = builderContainer.parentNode;
            const builderContainersInParent = parent.querySelectorAll('.builder-container');
            if (newQuantityValue === 0 && builderContainersInParent.length > 1) {
                const previousBuilderContainer = builderContainer.previousElementSibling;
                const stickerBorder = builderContainer.querySelector(".sticker-border-sum");
                const parent = builderContainer.parentNode;
                const builderContainersInParent = parent.querySelectorAll('.builder-container');
                if (previousBuilderContainer) {
                    // Scroll the previous builder container into view
                    previousBuilderContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                if (builderContainer) {
                    stickerBorder.style.borderColor = "red";
                    const addBtnSumElements = builderContainer.querySelectorAll(".add-btn-sum");
                    addBtnSumElements.forEach((addBtnSum) => {
                        const imgElement = addBtnSum.querySelector("img");
                        imgElement.src = "/src/assets/btn-plain-red.png";
                    });
                    const addQuantityBtn = builderContainer.querySelector(".add-btn-sum-small");
                    const imgElement = addQuantityBtn.querySelector("img");
                    imgElement.src = "/src/assets/del-btn.svg";
                    builderContainer.classList.add("fade-out");
                    setTimeout(() => {
                        builderContainer.remove();
                        if (builderContainer === builderContainersInParent[0]) {
                            const divider = builderContainersInParent[1].querySelector(".divider");
                            divider.style.display = 'none';
                        }
                    }, 500); // Wait for the transition to finish (500ms in this example)
                }
                /* logic for removing divider on first sticker */
            } else if (newQuantityValue === 0 && !(builderContainersInParent.length > 1)) {
                quantityText.textContent = "1";
                // Add the "shake" class to apply the animation
                builderContainer.classList.add('shake');
                // Remove the "shake" class after the animation completes
                builderContainer.addEventListener('animationend', () => {
                    builderContainer.classList.remove('shake');
                });
            }
        }
        updateCart();
    }

    // Handles click events for increasing quantity in the user interface.
    function addBtnClickQuantity(event, quantityText) {
        const quantityValue = parseInt(quantityText.textContent);
        const newQuantityValue = quantityValue + 1;
        quantityText.textContent = "" + newQuantityValue;
        updateCart();
    }


}





async function getPrice() {

    var countryCode = await fetchUserCountry();

    const apiUrl = 'https://api.carsalestickers.com/product?country=' + countryCode.toLowerCase() + '&stage=' + env;
    console.log(apiUrl);

    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
        .then(data => {
            // Handle the data
            console.log(data);



            if (getCookie("productPrice") === undefined || productPrice === undefined) {
                document.cookie = "productPrice=" + encodeURIComponent(data.price) + "; path=/";
                productPrice = data.price;
            } else if ((data.price !== getCookie("productPrice") || data.price !== productPrice) && data.price) {
                document.cookie = "productPrice=" + encodeURIComponent(data.price) + "; path=/";
                productPrice = data.price;
            }

            updateCart();

            // You can access specific values like this:
            const stripePrice = data.stripePrice;
            const price = data.price;
            const sticker = data.sticker;
            const stage = data.stage; 4
            var headerSection = document.querySelector('.header-section');
            stickerType = sticker;


            console.log(price);

            // Perform further actions with the data as needed
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    // -------------------------------------------------------------------

    async function fetchUserCountry() {
        try {
            const response = await fetch("https://freeipapi.com/api/json");
            const data = await response.json();
            //ipaddr = data.ipString;
            console.log('country: ');
            console.log(data.countryCode);
            return "" + data.countryCode;
        } catch (error) {
            console.error(error);
            return null; // Return null if the IP fetch fails
        }
    }
}


// =============================================================================
// Handles the focusout event for input fields, adjusting styles.
// =============================================================================
function handleFocusOut() {
    if (this.value !== this.placeholder) {
        this.style.color = 'white';
    }
    this.style.backgroundColor = 'transparent'; // Set it back to the default background color
    //this.style.maxWidth = Math.max(this.length) + "ch";
}


// =============================================================================
// Dynamically adjusts the width and font size of input fields based on their content.
// =============================================================================
function resizeInput(forSaleTxt, userInput, inputField) {
    /*
        try {
            this.style.maxWidth = Math.max(this.value.length) + "ch";
        } catch (error) {
            // console.error('An error occurred:', error.message);
        }
        */
    if (forSaleTxt && userInput) {
        if (inputField === 'email') {
            if (userInput.value.length >= 10 && userInput.value.indexOf('@') + 6 <= userInput.value.length && userInput.value.includes('@')) {
                console.log("email");
                var referenceText = forSaleTxt.textContent;
                var targetText = userInput.value;
                const computedStyle = window.getComputedStyle(forSaleTxt);
                var referenceFontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
                var desiredFontSize = calculateFontSizeToMatchWidth(referenceText, targetText, referenceFontSize);
                // Apply the desired font size to the target text
                userInput.style.fontSize = `${desiredFontSize}px`;
            } else {
                console.log("email - fall back");
                var referenceText = forSaleTxt.textContent;
                var targetText = "your.email@example.com";
                const computedStyle = window.getComputedStyle(forSaleTxt);
                var referenceFontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
                var desiredFontSize = calculateFontSizeToMatchWidth(referenceText, targetText, referenceFontSize);
                // Apply the desired font size to the target text
                userInput.style.fontSize = `${desiredFontSize}px`;
                userInput.style.cssText += `font-size: ${desiredFontSize}px;`;
            }
        } else if (inputField === 'phone') {
            console.log(userInput.value.length);
            if (userInput.value.length >= 7) {
                console.log("phone");
                var referenceText = forSaleTxt.textContent;
                var targetText = userInput.value;
                const computedStyle = window.getComputedStyle(forSaleTxt);
                var referenceFontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
                var desiredFontSize = calculateFontSizeToMatchWidth(referenceText, targetText, referenceFontSize);
                // Apply the desired font size to the target text
                userInput.style.fontSize = `${desiredFontSize}px`;
            } else {
                console.log("phone - fall back");
                var referenceText = forSaleTxt.textContent;
                var targetText = "555-555-5555";
                const computedStyle = window.getComputedStyle(forSaleTxt);
                var referenceFontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
                var desiredFontSize = calculateFontSizeToMatchWidth(referenceText, targetText, referenceFontSize);
                // Apply the desired font size to the target text
                userInput.style.fontSize = `${desiredFontSize}px`;
                userInput.style.cssText += `font-size: ${desiredFontSize}px;`;
            }
        }
        if (userInput.value.length != 0) {
            console.log('normal');
            // this.style.maxWidth = Math.max(this.value.length) + "ch";
            console.log('anser: ' + userInput.value.length + "ch");
            console.log((Math.max(userInput.value.length, userInput.placeholder.length) - 2));
            console.log((Math.max(userInput.value.length, userInput.placeholder.length)));
            //this.maxWidth = this.length + "ch";
            const fontSizeInPx = 16; // Hardcoded font size in pixels
            userInput.style.width = (userInput.value.length * fontSizeInPx / 16) + "ch";
            //userInput.style.width = (Math.max(userInput.value.length) ) + "ch";
        } else if (userInput.placeholder.length != 0) {
            console.log('placeholder');
            userInput.style.width = (Math.max(userInput.placeholder.length)) + "ch";
        }

    }

    // Calculates the font size needed to match the width of a text element.
    function calculateFontSizeToMatchWidth(referenceText, targetTextValue, referenceFontSize) {
        // Access the value of the input box
        var referenceWidth = getTextWidth(referenceText, referenceFontSize);
        const ghostSpaceWidth = getTextWidth('a', referenceFontSize);
        const spaceWidth = getTextWidth('a', 20);
        console.log(`${referenceWidth} | ${spaceWidth} | ${ghostSpaceWidth}`);
        referenceWidth = (referenceWidth - ghostSpaceWidth) + spaceWidth;
        const targetWidth = getTextWidth(targetTextValue, referenceFontSize);
        const desiredFontSize = ((referenceFontSize * referenceWidth) / targetWidth);

        return desiredFontSize;


        // Measures the width of a given text string with a specific font size.
        function getTextWidth(text, fontSize) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            //context.font = `${fontSize}px Arial`;
            context.font = `${fontSize}px  Montserrat, sans-serif`;
            return context.measureText(text).width;
        }
    }
}



async function updateIntent() {
    var expressDiv = document.getElementById('express-checkout-element');
    var loadingBar = document.querySelector('.loading-bar');
    var expressTitle = document.getElementById('express-title');


    var budgetOption = document.getElementById("budget");
    var standardOption = document.getElementById("standard");
    var expressOption = document.getElementById("express");

    var budgetPrice = document.getElementById("budget-price");
    var standardPrice = document.getElementById("standard-price");
    var expressPrice = document.getElementById("express-price");


    if (fetchingData) {
        pendingRequest = true;
        console.log("already running | pending: " + pendingRequest);
        return;
    } else {
        console.log("running | pending: " + pendingRequest);
        fetchingData = true;
        pendingRequest = false;
        expressDiv.style.display = 'none';
        if (window.getComputedStyle(expressTitle).display !== 'none') {

            loadingBar.style.display = 'flex';
        } else {
            loadingBar.style.display = 'none';
        }



        var payload = {
            requestType: "updateIntent",
            customerDetails: {
                intentID: intentID,
                shippingMethod: shippingMethod,
                ipAddress: await fetchUserIP(),

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
                console.log(data.body);


                if (data.body) {

                    if (productPrice === undefined) {
                        productPrice = data.body.productPrice;
                    } else if ((data.body.productPrice !== productPrice) && data.body.productPrice) {
                        productPrice = data.body.productPrice;
                    }

                    if (shippingPrices === undefined) {
                        console.log(shippingPrices);
                        shippingPrices = data.shippingQuotes;
                        console.log("setting: " + shippingPrices);
                    } else if ((data.shippingQuotes !== shippingPrices) && data.shippingQuotes) {
                        console.log(shippingPrices);
                        shippingPrices = data.shippingQuotes;
                        console.log("changing: " + shippingPrices);
                    }

                }

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


            })
            .catch((error) => {
                console.error("Error:", error);
            });

        updateData.then(() => {
            console.log('updated');

            updateStickerPrice();
            if (elements) {
                elements.fetchUpdates()
                    .then(function (result) {
                        // Handle result.error




                        if (pendingRequest) {

                            setTimeout(() => {
                                fetchingData = false;

                                updateIntent();

                            }, 5000);


                        } else {
                            fetchingData = false;

                            if (window.getComputedStyle(expressTitle).display !== 'none') {
                                loadingBar.style.display = 'none';
                                expressDiv.style.display = 'block';
                            }

                        }

                    });

            } else {
                if (pendingRequest) {

                    setTimeout(() => {
                        fetchingData = false;

                        updateIntent();

                    }, 5000);


                } else {
                    fetchingData = false;
                    if (window.getComputedStyle(expressTitle).display !== 'none') {
                        //  loadingBar.style.display = 'none';
                        //   expressDiv.style.display = 'block';
                    }

                }
            }

            // Add your additional code here.
        });
    }

}


function updateStickerPrice() {
    let price = productPrice;
    let builderContainers = document.querySelectorAll('.builder-container');
    var subTotalText = document.querySelector(".subTotalSum1");
    var mobileSubTotal = document.querySelector(".payment-subtotal");
    var orderTotalText = document.querySelector(".orderTotal");
    var mobileTotalText = document.querySelector(".payment-total");
    /* Shipping Cost */
    var shippingInput = document.querySelector(".dropbtn");
    //var shippingValue = shippingInput.textContent.replace(/\s|\$/g, '').toLowerCase();
    var shippingValue;
    var shippingValueDesktop = document.querySelector(".shipping-cost1");
    var shippingValueMobile = document.querySelector(".shipping-cost2");


    var subTotal = 0;
    var orderTotal = 0;
    let itemQuantity = 0;
    builderContainers.forEach((container) => {
        // Check if .sticker-border-sum exists in this container
        const priceText = container.querySelector('.price-num');
        const stickerQuantity = container.querySelector('.quantity-num');
        const quantity = parseInt(stickerQuantity.textContent);
        if ((quantity * price)) {
            priceText.textContent = "$" + (quantity * price).toFixed(2);
            subTotal += (quantity * price);
            itemQuantity += quantity;
        }

    });

    console.log(shippingMethod);
    if (shippingMethod === "select" || shippingMethod === "free" || shippingMethod === undefined || shippingMethod === 'budget') {
        shippingValueMobile.textContent = "Free";
        shippingValueDesktop.textContent = "Free";
        orderTotal += 0;
    } else {

        if (shippingMethod === 'standard') {
            shippingValueMobile.textContent = "$" + (shippingPrices.standard).toFixed(2);
            shippingValueDesktop.textContent = "$" + (shippingPrices.standard).toFixed(2);
            shippingValue = shippingPrices.standard;;
        } else if (shippingMethod === 'express') {
            shippingValueMobile.textContent = "$" + (shippingPrices.express).toFixed(2);
            shippingValueDesktop.textContent = "$" + (shippingPrices.express).toFixed(2);
            shippingValue = shippingPrices.express;
        }

        /*
        shippingValueMobile.textContent = "$" + shippingValue;
        */
        orderTotal += Number(parseFloat(shippingValue));

    }
    subTotalText.textContent = "$" + subTotal.toFixed(2);
    mobileSubTotal.textContent = subTotalText.textContent;
    orderTotal += subTotal;
    orderTotalText.textContent = "$" + orderTotal.toFixed(2) + " USD";
    cartValue = subTotal.toFixed(2);

    mobileTotalText.textContent = orderTotalText.textContent;

    var paymentList = document.querySelector('.payment-list');

 
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
        titleDiv.textContent = item.quantity + "x " + item.item;

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
        priceDiv.textContent = "$" + (price * item.quantity).toFixed(2); // You may need to calculate the price based on the cart data

        listItem.appendChild(detailsDiv);
        listItem.appendChild(priceDiv);

        paymentList.appendChild(listItem);
    });


}

function policiesPopup() {

    // JavaScript to handle the refund button click
    document.getElementById("refund-btn").addEventListener("click", function () {
        let popupContainer = document.getElementById("popup-container");
        let popupContent = document.getElementById("popup-content");
        popupContainer.style.display = "block";
        let firstChild = popupContent.firstChild;

        // Create and append the iframe
        let iframe = document.createElement("iframe");
        iframe.src = "/policies/refunds/index.html";
        iframe.id = "iframe-container";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("width", "100% !important");
        iframe.setAttribute("height", "100%");
        iframe.style.minWidth = '100%';



        popupContent.insertBefore(iframe, firstChild);


    });

    document.getElementById("privacy-btn").addEventListener("click", function () {
        let popupContainer = document.getElementById("popup-container");
        let popupContent = document.getElementById("popup-content");
        popupContainer.style.display = "block";
        let firstChild = popupContent.firstChild;

        // Create and append the iframe
        let iframe = document.createElement("iframe");
        iframe.src = "/policies/privacy/index.html";
        iframe.id = "iframe-container";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("width", "100% !important");
        iframe.setAttribute("height", "100%");
        iframe.style.minWidth = '100%';


        popupContent.insertBefore(iframe, firstChild);


    });

    document.getElementById("terms-btn").addEventListener("click", function () {
        let popupContainer = document.getElementById("popup-container");
        let popupContent = document.getElementById("popup-content");
        popupContainer.style.display = "block";
        let firstChild = popupContent.firstChild;

        // Create and append the iframe
        let iframe = document.createElement("iframe");
        iframe.src = "/policies/terms/index.html";
        iframe.id = "iframe-container";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("width", "100% !important");
        iframe.setAttribute("height", "100%");
        iframe.style.minWidth = '100%';



        popupContent.insertBefore(iframe, firstChild);


    });


}

// JavaScript to close the popup and remove the appended iframe
function closePopup() {
    // needs to be global until event listeners are added
    let popupContainer = document.getElementById("popup-container");
    //var popupContent = document.getElementById("popup-content");

    let iframeContainerToRemove = document.getElementById("iframe-container");
    if (iframeContainerToRemove) {
        iframeContainerToRemove.parentNode.removeChild(iframeContainerToRemove);
    }

    popupContainer.style.display = "none";
}








