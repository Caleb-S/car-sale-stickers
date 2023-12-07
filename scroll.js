document.addEventListener("DOMContentLoaded", function () {
    const scrollbox = document.querySelector(".product-scrollbox");
    const scrollSpeed = 1;
    const scrollThreshold = 0.10;

    let isScrolling = false;
    let scrollDirection = 0;

    function scrollBox() {
        if (isScrolling && scrollDirection !== 0) {
            scrollbox.scrollTop += scrollDirection * scrollSpeed;
        }
        requestAnimationFrame(scrollBox);
    }

    requestAnimationFrame(scrollBox);

    scrollbox.addEventListener("mousemove", function (event) {
        const scrollboxHeight = scrollbox.clientHeight;
        const mouseY = event.clientY - scrollbox.getBoundingClientRect().top;

        const distanceFromTop = scrollbox.scrollTop;
        const distanceFromBottom = scrollbox.scrollHeight - scrollbox.scrollTop - scrollboxHeight;
        const distanceFromThreshold = scrollboxHeight * scrollThreshold;






        const screenWidth = document.documentElement.clientWidth;
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
    const orderSubtotalDiv = document.querySelector(".order-subtotal");
    const productSummaryDiv = document.querySelector(".product-scrollbox");

    orderSubtotalDiv.addEventListener("click", function () {
        const startScroll = productSummaryDiv.scrollTop;
        const targetScroll = productSummaryDiv.scrollHeight;

        const distance = targetScroll - startScroll;
        const animationDuration = 1000;

        let startTime = null;

        function animationStep(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const scrollAmount = easeInOutCubic(progress, startScroll, distance, animationDuration);
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

const productScrollbox = document.querySelector('.product-scrollbox');
const orderSubtotal = document.querySelector('.order-subtotal');

function isScrolledToBottom() {
    const { scrollTop, scrollHeight, clientHeight } = productScrollbox;
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