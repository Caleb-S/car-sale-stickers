document.addEventListener("DOMContentLoaded", () => {
    // JavaScript
    const mobileText = document.getElementById('sticker-num');
    const mobileButton = document.getElementById('mobile-btn');
    const mobileImage = mobileButton.querySelector('img');
    mobileText.style.display = 'none';

    const emailText = document.getElementById('sticker-mail');
    const emailButton = document.getElementById('email-btn');
    const emailImage = emailButton.querySelector('img');
    emailText.style.display = 'none';

    mobileButton.addEventListener('click', () => {
        if (mobileText.style.display === 'none') {
            mobileText.style.display = 'block';
            mobileImage.setAttribute("src", "assets/remove-btn.png");
        } else {
            mobileText.style.display = 'none';
            mobileImage.setAttribute("src", "assets/add-btn.png");
        }
    });

    emailButton.addEventListener('click', () => {
        if (emailText.style.display === 'none') {
            emailText.style.display = 'block';
            emailImage.setAttribute("src", "assets/remove-btn.png");
        } else {
            emailText.style.display = 'none';
            emailImage.setAttribute("src", "assets/add-btn.png");
        }
    });

    document.getElementById("orderButton").addEventListener("click", () => {
        // Construct the URL with query parameters
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

        // Navigate to the payment.html page with the parameters
        window.location.href = "payment.html?" + params.toString();
    });
});

// Utility function
function getTextWidth(text, font) {
    // Create an off-screen canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    // Set the font for the context
    context.font = font;
    // Measure the text width
    const textWidth = context.measureText(text).width;
    // Clean up
    canvas.remove();
    return textWidth;
}

// Event listeners for resizing input fields
var numInput = document.querySelector('.num-input'); // get the .num-input element
var mailInput = document.querySelector('.mail-input'); // get the .mail-input element

numInput.addEventListener('input', resizeInput); // bind the "resizeInput" callback on "input" event
numInput.addEventListener('focus', handleFocus); // bind the "handleFocus" callback on "focus" event
numInput.addEventListener('blur', handleBlur); // bind the "handleBlur" callback on "blur" event
numInput.addEventListener('focusin', handleFocusIn);
numInput.addEventListener('focusout', handleFocusOut);

mailInput.addEventListener('input', resizeInput); // bind the "resizeInput" callback on "input" event
mailInput.addEventListener('focus', handleFocus); // bind the "handleFocus" callback on "focus" event
mailInput.addEventListener('blur', handleBlur); // bind the "handleBlur" callback on "blur" event
mailInput.addEventListener('focusin', handleFocusIn);
mailInput.addEventListener('focusout', handleFocusOut);

// Initialize the inputs with the placeholder text
numInput.value = numInput.placeholder;
resizeInput.call(numInput);

mailInput.value = mailInput.placeholder;
resizeInput.call(mailInput);

function resizeInput() {
    this.style.width = Math.max(this.value.length, this.placeholder.length) + "ch";
}

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
    this.style.backgroundColor = 'transparent'; // Set it back to the default background color
}

function handleBlur() {
    if (this.value === '') {
        this.value = this.placeholder;
        this.style.color = 'rgb(136, 134, 134)';
        this.style.backgroundColor = 'rgb(25, 25, 25)';
        resizeInput.call(this);
    }
}
