document.addEventListener("DOMContentLoaded", function () {
    
   const scrollSpeed = 1;
 

    let isScrolling = false;
    let scrollDirection = 0;
    let scrollboxElement = document.querySelector(".product-scrollbox");

    function scrollBox() {
        console.log("scrollBox");
        if (isScrolling && scrollDirection !== 0) {
            scrollboxElement.scrollTop += scrollDirection * scrollSpeed;
        }
        if (isScrolling) {
        requestAnimationFrame(scrollBox);
            
        }
    }

    scrollboxElement.addEventListener("mousemove", function (event) {
        if (!isScrolling) { 
        requestAnimationFrame(scrollBox);
        }
        let { newScrolling, newDirection } = startScrolling(event, isScrolling, scrollDirection);
        isScrolling = newScrolling;
        scrollDirection = newDirection;
    });

    function stopScrolling() {
        isScrolling = false;
        scrollDirection = 0;
    }

    scrollboxElement.addEventListener("mouseleave", stopScrolling);
});

    function startScrolling(event, isScrolling, scrollDirection) {
        let scrollbox = document.querySelector(".product-scrollbox");
        let scrollThreshold = 0.10;
        const scrollboxHeight = scrollbox.clientHeight;
        const mouseY = event.clientY  - scrollbox.getBoundingClientRect().top;

        const distanceFromTop = scrollbox.scrollTop;
        const distanceFromBottom = scrollbox.scrollHeight - scrollbox.scrollTop - scrollboxHeight;
        const thresholdDistance = scrollboxHeight * scrollThreshold;

        const screenWidth = document.documentElement.clientWidth;

        // Only apply scrolling logic for screens larger than 639px width
        if (screenWidth > 639) {
            if (mouseY < thresholdDistance) {
                // Near the top, scroll up
                return { newScrolling: true, newDirection: -1 };
            } else if (mouseY > scrollboxHeight - thresholdDistance) {
                // Near the bottom, scroll down
                return { newScrolling: true, newDirection: 1 };
            }
        }
        // Stop scrolling if outside thresholds
        return { newScrolling: false, newDirection: 0 };
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
