document.addEventListener("DOMContentLoaded", function () {
    const scrollbox = document.querySelector(".product-scrollbox");
    const scrollSpeed = 1; // Adjust this value to control the scrolling speed
    const scrollThreshold = 0.30; // 25% away from the top or bottom


    let scrollDirection = 0;

    // Function to scroll the container
    function scrollBox() {
        if (isScrolling && scrollDirection !== 0) {
            // Apply smooth scrolling
            scrollbox.scrollTop += scrollDirection * scrollSpeed;
        }
        requestAnimationFrame(scrollBox);
    }

    // Start the scrolling loop
    requestAnimationFrame(scrollBox);

    scrollbox.addEventListener("mousemove", function (event) {
        const scrollboxHeight = scrollbox.clientHeight;
        const scrollableHeight = scrollbox.scrollHeight - scrollboxHeight;
        const mouseY = event.clientY;

        // Check distance from top and bottom
        const distanceFromTop = scrollbox.scrollTop;
        const distanceFromBottom = scrollableHeight - scrollbox.scrollTop;
        const distanceFromThreshold = scrollboxHeight * scrollThreshold;

        // Determine the scroll direction
        if (distanceFromTop <= distanceFromThreshold && mouseY < distanceFromThreshold) {
            scrollDirection = -1; // Scroll up
            isScrolling = true;
        } else if (distanceFromBottom <= distanceFromThreshold && mouseY > scrollboxHeight - distanceFromThreshold) {
            scrollDirection = 1; // Scroll down
            isScrolling = true;
        } else {
            scrollDirection = 0; // Not scrolling
            isScrolling = false;
        }
    });

    scrollbox.addEventListener("mouseleave", function () {
        // Stop scrolling when the mouse leaves the scrollbox
        isScrolling = false;
        scrollDirection = 0;
    });
});