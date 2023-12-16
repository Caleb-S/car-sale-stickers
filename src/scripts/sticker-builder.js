/* ============================================
   Event Listener for DOM Content Load
   ============================================ */

var ipaddr;
var shippingPrices;
var url = "https://api.carsalestickers.com/stripe";

getPrice();


document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with the class 'sticker-builder'
    const stickerBuilders = document.querySelectorAll('.sticker-builder');

    stickerBuilders.forEach((stickerBuilder) => {
        const mobileText = stickerBuilder.querySelector('.num-input');
        const mobileButton = stickerBuilder.querySelector('.mobile-btn');
        const mobileLabel = stickerBuilder.querySelector('.mobile-txt');
        const mobileImage = mobileButton.querySelector('img');
        mobileText.style.display = 'none';

        const emailText = stickerBuilder.querySelector('.mail-input');
        const emailButton = stickerBuilder.querySelector('.email-btn');
        const emailLabel = stickerBuilder.querySelector('.mail-txt');
        const emailImage = emailButton.querySelector('img');
        emailText.style.display = 'none';

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
            const params = new URLSearchParams();
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
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}


async function getPrice() {



    var payload = {
        requestType: "getPrice",
        customerDetails: {
            ipAddress: await fetchUserIP()
        }
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



            if (productPrice === undefined) {
                document.cookie = "productPrice=" + encodeURIComponent(productPrice) + "; path=/";
            } else if ((data.body.productPrice !== productPrice) && data.body.productPrice) {
                document.cookie = "productPrice=" + encodeURIComponent(productPrice) + "; path=/";
            }

            if (shippingPrices === undefined) {
                console.log(shippingPrices);
                document.cookie = "shippingQuotes=" + encodeURIComponent(shippingPrices) + "; path=/";
                console.log("setting: " + shippingPrices);
            } else if ((data.shippingQuotes !== shippingPrices) && data.shippingQuotes) {
                console.log(shippingPrices);
                document.cookie = "shippingQuotes=" + encodeURIComponent(shippingPrices) + "; path=/";
                console.log("changing: " + shippingPrices);
            }

            // Set productPrice cookie


            // Set shippingQuotes cookie


        })
        .catch((error) => {
            console.error("Error:", error);
        });

    updateData.then(() => {

    });


}

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


