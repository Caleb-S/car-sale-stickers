document.addEventListener("DOMContentLoaded", function () {

    let isScrolling = false;
    let scrollDirection = 0;

    

    requestAnimationFrame(scrollBox);

    let scrollbox = document.querySelector(".product-scrollbox");
    scrollbox.addEventListener("mousemove", onMouseMove.bind(null, scrollbox, isScrolling, scrollDirection));

    function stopScrolling() {
        isScrolling = false;
        scrollDirection = 0;
    }

    scrollbox.addEventListener("mouseleave", stopScrolling);
});

function onMouseMove(event, isScrolling, scrollDirection) {
    const scrollSpeed = 1;
    const scrollThreshold = 0.10;
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
}



function scrollBox() {
    let scrollbox = document.querySelector(".product-scrollbox");
    if (isScrolling && scrollDirection !== 0) {
        scrollbox.scrollTop += scrollDirection * scrollSpeed;
    }
    requestAnimationFrame(scrollBox);
}

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
