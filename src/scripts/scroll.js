document.addEventListener("DOMContentLoaded", function () {
    let productScrollbox = document.querySelector(".product-scrollbox");
    let orderSubtotalDiv = document.querySelector(".order-subtotal");

    productScrollbox.addEventListener("scroll", updateCursorStyle);
    orderSubtotalDiv.addEventListener("click", scrollToBottom);

    scrollOnEdge();
    updateCursorStyle();
});

function scrollToBottom() {
    let productScrollbox = document.querySelector(".product-scrollbox");

    let scrollStart = productScrollbox.scrollTop;
    let distanceFromBottom  = productScrollbox.scrollHeight - scrollStart;
    let startTime = null;

    requestAnimationFrame(animationStep);

    function animationStep(timestamp) {
        const animationDuration = 1000;

        if (!startTime) startTime = timestamp;

        let progress = timestamp - startTime;
        let scrollAmount = easeInOutCubic(progress, scrollStart, distanceFromBottom, animationDuration);
        productScrollbox.scrollTo(0, scrollAmount);

        if (progress < animationDuration) {
            requestAnimationFrame(animationStep);
        }
    }

    function easeInOutCubic(currentTime, startValue, changeInValue, duration) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return (changeInValue / 2) * currentTime * currentTime * currentTime + startValue;
        }
        currentTime -= 2;
        return (changeInValue / 2) * (currentTime * currentTime * currentTime + 2) + startValue;
    }
}

function scrollOnEdge() {
    const scrollSpeed = 1;

    let productScrollbox = document.querySelector(".product-scrollbox");

    let isScrolling = false;
    let scrollDirection = 0;

    productScrollbox.addEventListener("mousemove", startScrolling);
    productScrollbox.addEventListener("mouseleave", stopScrolling);


    function startScrolling(event) {
        const scrollThreshold = 0.10;
        const minWindowWidth = 639;

        let screenWidth = document.documentElement.clientWidth;

        let scrollboxHeight = productScrollbox.clientHeight;
        let mouseY = event.clientY  - productScrollbox.getBoundingClientRect().top;

        let thresholdDistance = scrollboxHeight * scrollThreshold;

        !isScrolling && requestAnimationFrame(scrollBox);

        if (screenWidth > minWindowWidth) {
            if (mouseY < thresholdDistance) {
                // Near the top, scroll up
                isScrolling = true;
                scrollDirection =  -1;

            } else if (mouseY > scrollboxHeight - thresholdDistance) {
                // Near the bottom, scroll down
                isScrolling = true;
                scrollDirection =  1;

            } else {
                isScrolling = false 
                scrollDirection =  0;
            }
        }

        function scrollBox() {
            if (isScrolling && scrollDirection !== 0) {
                productScrollbox.scrollTop += scrollDirection * scrollSpeed;
            }
            if (isScrolling) {
                requestAnimationFrame(scrollBox);

            }
        }

        function stopScrolling() {
            isScrolling = false;
            scrollDirection =  0;
        }

    }
}

function updateCursorStyle() {
    let orderSubtotal = document.querySelector(".order-subtotal");

    isScrolledToBottom() ? orderSubtotal.style.cursor = "default" : orderSubtotal.style.cursor = "pointer";

    function isScrolledToBottom() {
        let productScrollbox = document.querySelector(".product-scrollbox");
        let { scrollTop, scrollHeight, clientHeight } = productScrollbox;

        return scrollTop + clientHeight >= scrollHeight;
    }
}


