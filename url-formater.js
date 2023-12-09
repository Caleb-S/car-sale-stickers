
//formatUrl();
document.addEventListener("DOMContentLoaded", () => {
    // Get the current URL




    // Introduce a one-second delay before updating the browser's URL
    setTimeout(() => {
        // formatUrl();


        // Update the browser's URL without reloading the page
        //  window.history.replaceState({}, document.title, cleanUrl);
    }, 1); // 1000 milliseconds = 1 second
});


function formatUrl() {
    var currentUrl = window.location.href;

    // Check if the URL ends with "index.html"
    if (currentUrl.endsWith("/index.html")) {
        // Remove only the "index.html" part
        var cleanUrl = currentUrl.replace(/\/index\.html$/, '/');
    } else {
        // Remove the ".html" part for other URLs
        var cleanUrl = currentUrl.replace(/\.html$/, '');
    }
    window.history.replaceState({}, document.title, cleanUrl);
}
