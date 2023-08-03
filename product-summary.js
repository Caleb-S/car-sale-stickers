document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const quantity = parseInt(params.get("quantity"));
    const numShow = params.get("sticker-num");
    const mailShow = params.get("sticker-mail");
    const numTextParam = params.get("num-text");
    const mailTextParam = params.get("mail-text");

    // Add Sticker.
    if (quantity === 1) {
        const variantBtn = document.querySelector(".variant-btn");
        const newOptionWrapper = createOptionWrapperElement();
        variantBtn.parentNode.insertBefore(newOptionWrapper, variantBtn);

    }

    const builderContainer = document.querySelector(".builder-container");

    if (builderContainer) {
        const parent = builderContainer.parentNode;
        const builderContainersInParent = parent.querySelectorAll('.builder-container');


        const divider = builderContainersInParent[0].querySelector(".divider");
        divider.style.display = 'none';

    }

    // change text and adjust visability of text.
    if (numShow === "show") {
        const mobileText = builderContainer.querySelector('#sticker-num');
        const mobileButton = builderContainer.querySelector('#mobile-btn');
        const mobileImage = mobileButton.querySelector('img');
        mobileText.style.display = 'block';
        mobileText.value = numTextParam;
        handleFocusOut.call(mobileText);
        mobileImage.setAttribute("src", "assets/remove-btn.png");
    }

    if (mailShow === "show") {
        const mailText = builderContainer.querySelector('#sticker-mail');
        const mailButton = builderContainer.querySelector('#email-btn');
        const mailImage = mailButton.querySelector('img');
        mailText.style.display = 'block';
        mailText.value = mailTextParam;
        handleFocusOut.call(mailText);
        mailImage.setAttribute("src", "assets/remove-btn.png");
    }




    const variantButton = document.querySelector(".variant-btn");
    variantButton.addEventListener("click", handleVariantButtonClick);

    function handleVariantButtonClick(event) {
        const newOptionWrapper = createOptionWrapperElement();
        event.currentTarget.parentNode.insertBefore(newOptionWrapper, event.currentTarget);

        /*
        const divider = document.createElement("div");
        divider.classList.add("divider");
        divider.classList.add("divider-custom");
        event.currentTarget.parentNode.insertBefore(divider, newOptionWrapper);
        */


        /* Move scroll to new variant */
        setTimeout(function (currentTarget) {
            currentTarget.scrollIntoView({ behavior: "smooth" });
        }, 200, event.currentTarget);

        /* logic for removing divider on first sticker */
        const builderContainer = document.querySelector(".builder-container");

        if (builderContainer) {
            const parent = builderContainer.parentNode;
            const builderContainersInParent = parent.querySelectorAll('.builder-container');


            const divider = builderContainersInParent[0].querySelector(".divider");
            divider.style.display = 'none';

        }

        /*

        const ids = ['sticker-num', 'sticker-mail'];
        const buttons = ['mobile-btn', 'email-btn'];

        for (let i = 0; i < ids.length; i++) {
            const itemText = builderContainer.getElementById(ids[i]);
            const button = builderContainer.getElementById(buttons[i]);

            button.addEventListener('click', () => {
                itemText.style.display = 'block';
            });
        }
        */

    }




    function createOptionWrapperElement() {
        const builderContainer = document.createElement("div");
        builderContainer.classList.add("builder-container");

        const divider = document.createElement("div");
        divider.classList.add("divider");
        divider.classList.add("divider-custom");
        builderContainer.appendChild(divider);

        /* Sticker Preview */
        const stickerBorder = document.createElement('div');
        stickerBorder.classList.add('sticker-border');
        builderContainer.appendChild(stickerBorder);

        const forSaleTxt = document.createElement('text');
        forSaleTxt.classList.add('sticker-for-sale-sum');
        forSaleTxt.textContent = 'FOR SALE';
        stickerBorder.appendChild(forSaleTxt);

        /*
        const stickerNumber = document.createElement('text');
        stickerNumber.classList.add('sticker-num-sum');
        stickerNumber.textContent = '555-555-5555';
        stickerBorder.appendChild(stickerNumber);
        stickerNumber.setAttribute("id", "sticker-num");
        stickerNumber.style.display = 'none';
        */
        const stickerNumber = document.createElement('input');
        stickerNumber.classList.add('sticker-input');
        stickerNumber.classList.add('num-input');
        stickerNumber.setAttribute("id", "sticker-num");
        stickerNumber.placeholder = '555-555-5555';
        stickerNumber.addEventListener('input', resizeInput);
        stickerNumber.addEventListener('focus', handleFocus);
        stickerNumber.addEventListener('blur', handleBlur);
        stickerNumber.addEventListener('focusin', handleFocusIn);
        stickerNumber.addEventListener('focusout', handleFocusOut);
        stickerBorder.appendChild(stickerNumber);
        resizeInput.call(stickerNumber);
        stickerNumber.style.display = 'none';



        /*
        const stickerEmail = document.createElement('text');
        stickerEmail.classList.add('sticker-email-sum');
        stickerEmail.textContent = 'Emmanuel.rodriguez@icloud.com';
        stickerBorder.appendChild(stickerEmail);
        stickerEmail.setAttribute("id", "sticker-mail");
        stickerEmail.style.display = 'none';
        */

        const stickerEmail = document.createElement('input');
        stickerEmail.classList.add('sticker-input');
        stickerEmail.classList.add('mail-input');
        stickerEmail.setAttribute("id", "sticker-mail");
        stickerEmail.placeholder = 'enter.emailaddress@here.com';
        stickerEmail.addEventListener('input', resizeInput);
        stickerEmail.addEventListener('focus', handleFocus);
        stickerEmail.addEventListener('blur', handleBlur);
        stickerEmail.addEventListener('focusin', handleFocusIn);
        stickerEmail.addEventListener('focusout', handleFocusOut);
        stickerBorder.appendChild(stickerEmail);
        resizeInput.call(stickerEmail);

        stickerEmail.style.display = 'none';


        /* Option Wrapper */
        const optionWrapper1 = document.createElement("div");
        optionWrapper1.classList.add("option-wrapper");
        builderContainer.appendChild(optionWrapper1);

        /* Mobile Number Option*/
        const addBtnNum = document.createElement("div");
        addBtnNum.classList.add("add-btn-sum");
        addBtnNum.setAttribute("id", "mobile-btn");

        const addBtnNumImg = document.createElement("img");
        addBtnNumImg.setAttribute("src", "assets/add-btn.png");
        addBtnNum.appendChild(addBtnNumImg);

        optionWrapper1.appendChild(addBtnNum);

        const NumOptionText = document.createElement("text");
        NumOptionText.classList.add("sticker-option-text");
        NumOptionText.textContent = "Mobile Number";
        optionWrapper1.appendChild(NumOptionText);

        addBtnNum.addEventListener('click', () => {


            if (stickerNumber.style.display === 'none') {
                stickerNumber.style.display = 'block';
                addBtnNumImg.setAttribute("src", "assets/remove-btn.png");
                stickerNumber.focus();
            } else {
                stickerNumber.style.display = 'none';
                addBtnNumImg.setAttribute("src", "assets/add-btn.png");
            }
        });

        /* Email Option*/
        const optionWrapper2 = document.createElement("div");
        optionWrapper2.classList.add("option-wrapper");
        builderContainer.appendChild(optionWrapper2);

        const addBtnMail = document.createElement("div");
        addBtnMail.classList.add("add-btn-sum");
        addBtnMail.setAttribute("id", "email-btn");

        const addBtnMailImg = document.createElement("img");
        addBtnMailImg.setAttribute("src", "assets/add-btn.png");
        addBtnMail.appendChild(addBtnMailImg);

        optionWrapper2.appendChild(addBtnMail);

        const MailOptionText = document.createElement("text");
        MailOptionText.classList.add("sticker-option-text");
        MailOptionText.textContent = "Email";
        optionWrapper2.appendChild(MailOptionText);

        addBtnMail.addEventListener('click', () => {


            if (stickerEmail.style.display === 'none') {
                stickerEmail.style.display = 'block';
                addBtnMailImg.setAttribute("src", "assets/remove-btn.png");
                stickerEmail.focus();
            } else {
                stickerEmail.style.display = 'none';
                addBtnMailImg.setAttribute("src", "assets/add-btn.png");
            }
        });


        /* Quantity Option */
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
        removeBtnQuantityImg.setAttribute("src", "assets/remove-btn.png");
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
        addBtnQuantityImg.setAttribute("src", "assets/add-btn.png");
        addBtnQuantity.appendChild(addBtnQuantityImg);

        const verticalWrapper2 = document.createElement("div");
        verticalWrapper2.classList.add("vertical-wrapper");
        horizontalWrapper.appendChild(verticalWrapper2);

        const priceText = document.createElement("text");
        priceText.classList.add("price-num");
        priceText.textContent = "$12";
        verticalWrapper2.appendChild(priceText);


        return builderContainer;
    }

    function addBtnClickQuantity(event, quantityText) {
        const quantityValue = parseInt(quantityText.textContent);
        const newQuantityValue = quantityValue + 1;
        quantityText.textContent = "" + newQuantityValue;




    }

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
                const stickerBorder = builderContainer.querySelector(".sticker-border");
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
                        imgElement.src = "assets/btn-plain-red.png";
                    });
                    const addQuantityBtn = builderContainer.querySelector(".add-btn-sum-small");
                    const imgElement = addQuantityBtn.querySelector("img");
                    imgElement.src = "assets/add-btn-delete.png";

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
    }



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
