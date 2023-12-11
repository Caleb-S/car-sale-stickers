/* ============================================
   Event Listener for DOM Content Load
   ============================================ */
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
