document.addEventListener("DOMContentLoaded", () => {

    // JavaScript
    const mobileText = document.getElementById('sticker-num');
    mobileText.style.display = 'none';
    const mobileButton = document.getElementById('mobile-btn');
    const mobileImage = mobileButton.querySelector('img');

    const emailText = document.getElementById('sticker-mail');
    emailText.style.display = 'none';
    const emailButton = document.getElementById('email-btn');
    const emailImage = emailButton.querySelector('img');


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


        /* https://example.com/other-page?sticker-num=show&sticker-mail=hide */

        if (mobileText.style.display === 'none') {
            params.append("sticker-num", "hide");


        } else {

            params.append("sticker-num", "show");
            params.append("num-text", mobileText.textContent);

        }

        if (emailText.style.display === 'none') {
            params.append("sticker-mail", "hide");


        } else {

            params.append("sticker-mail", "show");
            params.append("mail-text", emailText.textContent);

        }

        // Navigate to the payment.html page with the parameters
        window.location.href = "payment.html?" + params.toString();
    });



});



