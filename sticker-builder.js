document.addEventListener("DOMContentLoaded", () => {
    const variantButtons = document.querySelectorAll(".variant-btn");

    function handleVariantButtonClick(event) {
        const newOptionWrapper = createOptionWrapperElement();
        event.currentTarget.parentNode.insertBefore(newOptionWrapper, event.currentTarget);

        const divider = document.createElement("div");
        divider.classList.add("divider");
        divider.classList.add("divider-custom");
        event.currentTarget.parentNode.insertBefore(divider, newOptionWrapper);



        /* Move scroll to new variant */
        setTimeout(function (currentTarget) {
            currentTarget.scrollIntoView({ behavior: "smooth" });
        }, 200, event.currentTarget);

    }




    function createOptionWrapperElement() {
        const builderContainer = document.createElement("div");
        builderContainer.classList.add("builder-container");

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

    // Attach click event listener to each variant button
    variantButtons.forEach((btn) => {
        btn.addEventListener("click", handleVariantButtonClick);
    });
});
