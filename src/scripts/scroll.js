document.addEventListener("DOMContentLoaded", function () {
    const scrollSpeed = 1;
    const scrollThreshold = 0.10;

    let isScrolling = false;
    let scrollDirection = 0;
    let scrollbox = document.querySelector(".product-scrollbox");

    function scrollBox() {
        if (isScrolling && scrollDirection !== 0) {
            scrollbox.scrollTop += scrollDirection * scrollSpeed;
        }
        requestAnimationFrame(scrollBox);
    }

    requestAnimationFrame(scrollBox);

    scrollbox.addEventListener("mousemove", function (event) {
        let scrollboxHeight = scrollbox.clientHeight;
        let mouseY = event.clientY - scrollbox.getBoundingClientRect().top;

        let distanceFromTop = scrollbox.scrollTop;
        let distanceFromBottom = scrollbox.scrollHeight - scrollbox.scrollTop - scrollboxHeight;
        let distanceFromThreshold = scrollboxHeight * scrollThreshold;

        let screenWidth = document.documentElement.clientWidth;

        if (!(screenWidth >= 0 && screenWidth <= 639)) {
            if (scrollDirection === 1 && mouseY < distanceFromThreshold) {

                scrollDirection = 1;
                isScrolling = true;
            } else if (scrollDirection === -1 && mouseY > scrollboxHeight - distanceFromThreshold) {

                scrollDirection = -1;
                isScrolling = true;
            } else if (mouseY < distanceFromThreshold) {

                scrollDirection = -1;
                isScrolling = true;
            } else if (mouseY > scrollboxHeight - distanceFromThreshold) {

                scrollDirection = 1;
                isScrolling = true;
            } else if (scrollDirection != 0) {

                scrollDirection = 0;
                isScrolling = false;
            }
        }
    });

    function stopScrolling() {
        isScrolling = false;
        scrollDirection = 0;
    }

    scrollbox.addEventListener("mouseleave", stopScrolling);
});

document.addEventListener("DOMContentLoaded", function () {
    let orderSubtotalDiv = document.querySelector(".order-subtotal");
    let productSummaryDiv = document.querySelector(".product-scrollbox");

    orderSubtotalDiv.addEventListener("click", function () {
        let startScroll = productSummaryDiv.scrollTop;
        let targetScroll = productSummaryDiv.scrollHeight;

        let distance = targetScroll - startScroll;
        let animationDuration = 1000;

        let startTime = null;
        function animationStep(timestamp) {
            if (!startTime) startTime = timestamp;
            
            let progress = timestamp - startTime;
            let scrollAmount = easeInOutCubic(progress, startScroll, distance, animationDuration);
            productSummaryDiv.scrollTo(0, scrollAmount);

            if (progress < animationDuration) {
                requestAnimationFrame(animationStep);
            }
        }
        requestAnimationFrame(animationStep);
    });

    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }
});

let productScrollbox = document.querySelector('.product-scrollbox');
let orderSubtotal = document.querySelector('.order-subtotal');

function isScrolledToBottom() {
    let { scrollTop, scrollHeight, clientHeight } = productScrollbox;
    return scrollTop + clientHeight >= scrollHeight;
}

function updateCursorStyle() {
    if (isScrolledToBottom()) {
        orderSubtotal.style.cursor = 'default';
    } else {
        orderSubtotal.style.cursor = 'pointer';
    }
}

productScrollbox.addEventListener('scroll', updateCursorStyle);

updateCursorStyle();
