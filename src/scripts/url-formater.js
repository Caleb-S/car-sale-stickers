let currentUrl = window.location.href;
let urlWithoutTrailingSlash = removeTrailingSlash(currentUrl);

// Function to remove trailing slash from a URL
function removeTrailingSlash(url) {
    return url.replace(/\/$/, '');
}


history.replaceState({}, document.title, urlWithoutTrailingSlash);
