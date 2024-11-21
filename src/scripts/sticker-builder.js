/* ============================================
   Event Listener for DOM Content Load
   ============================================ */

var ipaddr;
var shippingPrices;
var url = "https://api.carsalestickers.com/stripe";
var env = 'live';
var loggingOn = true;

getPrice();



document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with the class 'sticker-builder'
    let stickerBuilders = document.querySelectorAll('.sticker-builder');

    stickerBuilders.forEach((stickerBuilder) => {
        // Mobile Events
        let mobileText = stickerBuilder.querySelector('.num-input');
        let mobileButton = stickerBuilder.querySelector('.mobile-btn');
        let mobileLabel = stickerBuilder.querySelector('.mobile-txt');
        let mobileImage = mobileButton.querySelector('img');
        mobileText.style.display = 'none';

        // Mobile button click event
        mobileButton.addEventListener('click', () => {
            if (mobileText.style.display === 'none') {
                mobileText.style.display = 'block';
                mobileImage.setAttribute("src", "/src/assets/del-btn.svg");
                mobileButton.setAttribute('aria-label', 'Remove mobile number from sticker');
                mobileText.focus();

                if (ipaddr !== undefined && ipaddr !== null) {
                } else {
                    getPrice();
                }

            } else {
                mobileText.style.display = 'none';
                mobileImage.setAttribute("src", "/src/assets/add-btn.svg");
                mobileButton.setAttribute('aria-label', 'Add mobile number to sticker');
            }
        });

        mobileLabel.addEventListener('click', () => {
            if (mobileText.style.display === 'none') {
                mobileText.style.display = 'block';
                mobileImage.setAttribute("src", "/src/assets/del-btn.svg");
                mobileButton.setAttribute('aria-label', 'Remove mobile number from sticker');
                mobileText.focus();
            } else {
                mobileText.style.display = 'none';
                mobileImage.setAttribute("src", "/src/assets/add-btn.svg");
                mobileButton.setAttribute('aria-label', 'Add mobile number to sticker');
            }
        });

        // Mobile button keydown event
        mobileButton.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                if (mobileText.style.display === 'none') {
                    mobileText.style.display = 'block';
                    mobileImage.setAttribute("src", "/src/assets/del-btn.svg");
                    mobileButton.setAttribute('aria-label', 'Remove mobile number from sticker');
                    mobileText.focus();
                } else {
                    mobileText.style.display = 'none';
                    mobileImage.setAttribute("src", "/src/assets/add-btn.svg");
                    mobileButton.setAttribute('aria-label', 'Add mobile number to sticker');
                }
            }
        });

        // Email Events 
        let emailText = stickerBuilder.querySelector('.mail-input');
        let emailButton = stickerBuilder.querySelector('.email-btn');
        let emailLabel = stickerBuilder.querySelector('.mail-txt');
        let emailImage = emailButton.querySelector('img');
        emailText.style.display = 'none';

        // Email button click event
        emailButton.addEventListener('click', () => {
            if (emailText.style.display === 'none') {
                emailText.style.display = 'block';
                emailImage.setAttribute("src", "/src/assets/del-btn.svg");
                emailButton.setAttribute('aria-label', 'Remove email from sticker');
                emailText.focus();
            } else {
                emailText.style.display = 'none';
                emailImage.setAttribute("src", "/src/assets/add-btn.svg");
                emailButton.setAttribute('aria-label', 'Add email to sticker');
            }

            if (ipaddr !== undefined && ipaddr !== null) {
            } else {
                getPrice();
            }
        });

        emailLabel.addEventListener('click', () => {
            if (emailText.style.display === 'none') {
                emailText.style.display = 'block';
                emailImage.setAttribute("src", "/src/assets/del-btn.svg");
                emailButton.setAttribute('aria-label', 'Remove email from sticker');
                emailText.focus();
            } else {
                emailText.style.display = 'none';
                emailImage.setAttribute("src", "/src/assets/add-btn.svg");
                emailButton.setAttribute('aria-label', 'Add email to sticker');
            }
        });

        // Email button keydown event
        emailButton.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                if (emailText.style.display === 'none') {
                    emailText.style.display = 'block';
                    emailImage.setAttribute("src", "/src/assets/del-btn.svg");
                    emailButton.setAttribute('aria-label', 'Remove email from sticker');
                    emailText.focus();
                } else {
                    emailText.style.display = 'none';
                    emailImage.setAttribute("src", "/src/assets/add-btn.svg");
                    emailButton.setAttribute('aria-label', 'Add email to sticker');
                }
            }
        });

        // Order button click event
        stickerBuilder.querySelector(".order-btn").addEventListener("click", () => {
            let params = new URLSearchParams();
            params.append("quantity", 1);

            if (mobileText.style.display === 'none') {
                params.append("sticker-num", "hide");
            } else {
                params.append("sticker-num", "show");
                params.append("num-text", mobileText.value);
            }

            if (emailText.style.display === 'none') {
                params.append("sticker-mail", "hide");
            } else {
                params.append("sticker-mail", "show");
                params.append("mail-text", emailText.value);
            }

            window.location.href = "checkout/index.html?" + params.toString();
        });
    });
});

function getCookie(name) {
    let cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        let [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}


async function getPriceOld() {
    let ipaddr = await fetchUserIP();
    let payload = {
        requestType: "getPrice",
        customerDetails: {
            ipAddress: ipaddr
        }
    };

    let updateData = fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    .then((response) => response.json())
    .then((data) => {
        // Set productPrice cookie
        let productPrice = data.body.productPrice;
        if (getCookie("productPrice") === undefined) {
            document.cookie = "productPrice=" + encodeURIComponent(productPrice) + "; path=/";
        } else if ((productPrice !== getCookie("productPrice")) && productPrice) {
            document.cookie = "productPrice=" + encodeURIComponent(productPrice) + "; path=/";
        }

        // Set shippingQuotes cookie
        let shippingPrices = data.shippingQuotes;
        if (getCookie("shippingPrices") === undefined) {
            document.cookie = "shippingQuotes=" + encodeURIComponent(shippingPrices) + "; path=/";
        } else if ((shippingPrices !== getCookie("shippingPrices")) && shippingPrices) {
            document.cookie = "shippingQuotes=" + encodeURIComponent(shippingPrices) + "; path=/";
        }

        if (loggingOn) {
            console.log(data.body);
        }
    })
    .catch((error) => {
        if (loggingOn) {
            console.error("Error:", error);
        }
    });
}

async function getPrice() {
    let countryCode = await fetchUserCountry();
    let apiUrl = 'https://api.carsalestickers.com/product?country=' + countryCode.toLowerCase() + '&stage=' + env;

    if (loggingOn) {
        console.log(apiUrl);
    }

    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        return response.json();
    })
    .then(data => {
        // let stripePrice = data.stripePrice;
        // let stage = data.stage; 

        let price = data.price;
        if (getCookie("productPrice") === undefined) {
            document.cookie = "productPrice=" + encodeURIComponent(price) + "; path=/";
        } else if ((price !== getCookie("productPrice")) && price) {
            document.cookie = "productPrice=" + encodeURIComponent(price) + "; path=/";
        }


        let sticker = data.sticker;
        if (sticker === 'opaque') {
            let headerSection = document.querySelector('.header-section');
            headerSection.style.backgroundImage = 'url(/src/assets/cover-photo-opaque.webp)';
        }

        if (loggingOn) {
            console.log(data);
            console.log(price);
        }
    })
    .catch(error => {
        if (loggingOn) {
            console.error('Fetch error:', error);
        }
    });
 }


async function fetchUserCountry() {
    try {
        let response = await fetch("https://freeipapi.com/api/json");
        let data = await response.json();
        let countryCode = "" + data.countryCode;
        // ipaddr = data.ipString;

        if (loggingOn) {
            console.log(`countryCode: ${countryCode}`);
        }

        return countryCode;

    } catch (error) {
        if (loggingOn) {
            console.error(error);
        }

        return null;
    }
}

async function fetchUserIP() {
    try {
        let response = await fetch("https://api.bigdatacloud.net/data/client-ip");
        let data = await response.json();
        let ipaddr = data.ipString;

        if (loggingOn) {
            console.log(`ipaddr: ${ipaddr}`);
        }

        return ipaddr;
    } catch (error) {
        if (loggingOn) {
            console.error(error);
        }

        return null; // Return null if the IP fetch fails
    }
}
/* ============================================
   Handle Input Fields and Resizing
   ============================================ */

// Select num and mail input fields
var numInputs = document.querySelectorAll('.num-input');
var mailInputs = document.querySelectorAll('.mail-input');

// Add event listeners and resize input fields
numInputs.forEach((numInput) => {
    numInput.addEventListener('focus', handleFocus);
    numInput.addEventListener('blur', handleBlur);
    numInput.addEventListener('focusin', handleFocusIn);
    numInput.addEventListener('focusout', handleFocusOut);
    numInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            numInput.blur();
        }
    });

    numInput.value = numInput.placeholder;
    resizeInput.call(numInput);
});

mailInputs.forEach((mailInput) => {
    mailInput.addEventListener('focus', handleFocus);
    mailInput.addEventListener('blur', handleBlur);
    mailInput.addEventListener('focusin', handleFocusIn);
    mailInput.addEventListener('focusout', handleFocusOut);
    mailInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            mailInput.blur();
        }
    });

    mailInput.value = mailInput.placeholder;
    resizeInput.call(mailInput);
});

// Function to resize input fields
function resizeInput() {
    this.style.width = Math.max(this.value.length, this.placeholder.length) + "ch";
}

// Functions for handling focus and blur
function handleFocus() {
    if (this.value === this.placeholder) {
        this.value = '';
        this.style.color = 'white';
        this.style.backgroundColor = 'rgb(25, 25, 25)';
        resizeInput.call(this);
    }
}

function handleFocusIn() {
    this.style.backgroundColor = 'rgb(25, 25, 25)';
}

function handleFocusOut() {
    if (this.value !== this.placeholder) {
        this.style.color = 'white';
    }
    this.style.backgroundColor = 'transparent';
}

function handleBlur() {
    if (this.value === '') {
        this.value = this.placeholder;
        this.style.color = 'rgb(136, 134, 134)';
        this.style.backgroundColor = 'rgb(25, 25, 25)';
        resizeInput.call(this);
    }
}


