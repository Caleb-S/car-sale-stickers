document.addEventListener("DOMContentLoaded", function () {
    const scrollbox = document.querySelector(".product-scrollbox");
    const scrollSpeed = 1; // Adjust this value to control the scrolling speed
    const scrollThreshold = 0.15; // 25% away from the top or bottom

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

        if (mouseY < distanceFromThreshold) {
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
});
