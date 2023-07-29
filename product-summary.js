document.addEventListener("DOMContentLoaded", () => {
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

        const stickerNumber = document.createElement('text');
        stickerNumber.classList.add('sticker-num-sum');
        stickerNumber.textContent = '555-555-5555';
        stickerBorder.appendChild(stickerNumber);
        stickerNumber.setAttribute("id", "sticker-num");


        const stickerEmail = document.createElement('text');
        stickerEmail.classList.add('sticker-email-sum');
        stickerEmail.textContent = 'Emmanuel.rodriguez@icloud.com';
        stickerBorder.appendChild(stickerEmail);
        stickerEmail.setAttribute("id", "sticker-mail");

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

        /* Email Option*/
        const optionWrapper2 = document.createElement("div");
        optionWrapper2.classList.add("option-wrapper");
        builderContainer.appendChild(optionWrapper2);

        const addBtnMail = document.createElement("div");
        addBtnMail.classList.add("add-btn-sum");
        addBtnMail.setAttribute("id", "mobile-btn");

        const addBtnMailImg = document.createElement("img");
        addBtnMailImg.setAttribute("src", "assets/add-btn.png");
        addBtnMail.appendChild(addBtnMailImg);

        optionWrapper2.appendChild(addBtnMail);

        const MailOptionText = document.createElement("text");
        MailOptionText.classList.add("sticker-option-text");
        MailOptionText.textContent = "Email";
        optionWrapper2.appendChild(MailOptionText);


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


                if (previousBuilderContainer) {
                    // Scroll the previous builder container into view
                    previousBuilderContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                if (builderContainer) {
                    stickerBorder.style.borderColor = "red";
                    const addBtnSumElements = builderContainer.querySelectorAll(".add-btn-sum");
                    addBtnSumElements.forEach((addBtnSum) => {
                        const imgElement = addBtnSum.querySelector("img");
                        imgElement.src = "assets/add-btn-delete.png";
                    });
                    const addQuantityBtn = builderContainer.querySelector(".add-btn-sum-small");
                    const imgElement = addQuantityBtn.querySelector("img");
                    imgElement.src = "assets/add-btn-delete.png";

                    builderContainer.classList.add("fade-out");
                    setTimeout(() => {
                        builderContainer.remove();
                    }, 500); // Wait for the transition to finish (500ms in this example)
                }

                /* logic for removing divider on first sticker */

                const parent = builderContainer.parentNode;
                const builderContainersInParent = parent.querySelectorAll('.builder-container');

                if (builderContainer === builderContainersInParent[0]) {
                    const divider = builderContainersInParent[1].querySelector(".divider");
                    divider.style.display = 'none';

                }







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

