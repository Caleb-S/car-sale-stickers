document.addEventListener("DOMContentLoaded", function () {
    const scrollbox = document.querySelector(".product-scrollbox");
    const scrollSpeed = 1; // Adjust this value to control the scrolling speed
    const scrollThreshold = 0.10; // 25% away from the top or bottom

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

        // Determine the scroll direction based on the mouse position and current scrolling direction
        if (scrollDirection === 1 && mouseY < distanceFromThreshold) {
            // Scrolling down, but the mouse is above the top threshold, continue scrolling down
            scrollDirection = 1;
            isScrolling = true;
        } else if (scrollDirection === -1 && mouseY > scrollboxHeight - distanceFromThreshold) {
            // Scrolling up, but the mouse is below the bottom threshold, continue scrolling up
            scrollDirection = -1;
            isScrolling = true;
        } else if (mouseY < distanceFromThreshold) {
            // Mouse near the top edge, scroll up
            scrollDirection = -1;
            isScrolling = true;
        } else if (mouseY > scrollboxHeight - distanceFromThreshold) {
            // Mouse near the bottom edge, scroll down
            scrollDirection = 1;
            isScrolling = true;
        } else {
            // Not scrolling
            scrollDirection = 0;
            isScrolling = false;
        }
    });

    function stopScrolling() {
        // Stop scrolling when the mouse leaves the scrollbox on any side
        isScrolling = false;
        scrollDirection = 0;
    }

    scrollbox.addEventListener("mouseleave", stopScrolling);
});

// Scroll to bottom when subtotal div clicked.
document.addEventListener("DOMContentLoaded", function () {
    const orderSubtotalDiv = document.querySelector(".order-subtotal");
    const productSummaryDiv = document.querySelector(".product-scrollbox");

    orderSubtotalDiv.addEventListener("click", function () {
        // Get the current scroll position
        const startScroll = productSummaryDiv.scrollTop;
        const targetScroll = productSummaryDiv.scrollHeight;

        // Calculate the distance to scroll and the total animation duration (in milliseconds)
        const distance = targetScroll - startScroll;
        const animationDuration = 1000; // 1000ms = 1 second

        // Store the starting timestamp
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

    // Easing function for smooth scrolling
    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }
});

// Pointer control for subtotal div, if scrollbox not at bottom show pointer
const productScrollbox = document.querySelector('.product-scrollbox');
const orderSubtotal = document.querySelector('.order-subtotal');

// Function to check if the .product-scrollbox is scrolled to the bottom
function isScrolledToBottom() {
    const { scrollTop, scrollHeight, clientHeight } = productScrollbox;
    return scrollTop + clientHeight >= scrollHeight;
}

// Function to update the cursor style based on the scroll position
function updateCursorStyle() {
    if (isScrolledToBottom()) {
        orderSubtotal.style.cursor = 'default';
    } else {
        orderSubtotal.style.cursor = 'pointer';
    }
}

// Attach event listener to update cursor style when scrolling
productScrollbox.addEventListener('scroll', updateCursorStyle);

// Initial check for cursor style when the page loads
updateCursorStyle();