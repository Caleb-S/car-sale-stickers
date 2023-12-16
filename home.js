// =============================================================================
// Script 1
// =============================================================================
var script = document.createElement('script');

script.type = 'text/javascript';
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie_light.min.js';
script.async = true;
script.loading = 'none';
//script.defer = true;

script.onload = function() {
const animation = lottie.loadAnimation({
  container: document.querySelector('.sales-lotte'), // Replace with your specific selector
  loop: true,
  autoplay: false,
  path: 'https://lottie.host/1330341b-c93d-4a94-80c3-0283fbc902a6/dK6oWNihUp.json', // Replace with the path to your animation JSON file
});

 // Function to start the animation
 function startAnimation() {
  animation.play();
}

// Function to stop the animation
function stopAnimation() {
  animation.pause();
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animation is in the viewport, start it
      startAnimation();
    } else {
      // Animation is out of the viewport, stop it
      stopAnimation();
    }
  });
});

observer.observe(document.querySelector('.sales-lotte'));
};


document.head.appendChild(script);




// Initialize the Intersection Observer


// Observe the Lottie container





// =============================================================================
// Script 2
// =============================================================================





var numInputs = document.querySelectorAll('.num-input');
var mailInputs = document.querySelectorAll('.mail-input');
var forSaleTxt = document.querySelector('.sticker-for-sale');

numInputs.forEach(inputElement => {
  inputElement.addEventListener('input', () => {
   
    console.log('phone - change');
    console.log(`1. ${forSaleTxt} 2. ${inputElement.value}`);
    resizeInputFont(forSaleTxt, inputElement, 'phone');
    //inputElement.style.maxWidth = Math.max(inputElement.value.length) + "ch";
  });
  inputElement.addEventListener('focus', () => {
   
   console.log('phone - change');
   console.log(`1. ${forSaleTxt} 2. ${inputElement.value}`);
   resizeInputFont(forSaleTxt, inputElement, 'phone');
  // inputElement.style.maxWidth = Math.max(inputElement.value.length) + "ch";
 });

 inputElement.addEventListener('input', function () {
    // Remove any characters that are not valid in a phone number
    inputElement.value = inputElement.value.replace(/[^0-9+()\s\-]/g, '');
});
 
});

mailInputs.forEach(inputElement => {
  inputElement.addEventListener('input', () => {
    console.log('mail - change');
    console.log(`1. ${forSaleTxt} 2. ${inputElement}`);
    resizeInputFont(forSaleTxt, inputElement, 'email');
   // inputElement.style.maxWidth = Math.max(inputElement.value.length) + "ch";
  });
  inputElement.addEventListener('focus', () => {
    console.log('mail - change');
    console.log(`1. ${forSaleTxt} 2. ${inputElement}`);
    resizeInputFont(forSaleTxt, inputElement, 'email');
    //inputElement.style.maxWidth = Math.max(inputElement.value.length) + "ch";
  });


  inputElement.addEventListener('input', function () {
    // Remove any characters that are not valid in an email address
    inputElement.value = inputElement.value.replace(/[^a-zA-Z0-9@._-]/g, '');
});


});



function resizeInputFont(forSaleTxt, userInput, inputField) {
    if (forSaleTxt && userInput) {
        if (inputField === 'email') {
            if (userInput.value.length >= 10 && userInput.value.indexOf('@') + 6 <= userInput.value.length && userInput.value.includes('@')) {




                console.log("email");
                var referenceText = forSaleTxt.textContent;
                var targetText = userInput.value;
                const computedStyle = window.getComputedStyle(forSaleTxt);
                var referenceFontSize = parseFloat(computedStyle.getPropertyValue('font-size'));


                var desiredFontSize = calculateFontSizeToMatchWidth(referenceText, targetText, referenceFontSize);


                // Apply the desired font size to the target text
                userInput.style.fontSize = `${desiredFontSize}px`;



            } else {


                console.log("email - fall back");
                var referenceText = forSaleTxt.textContent;
                var targetText = "your.email@example.com";
                const computedStyle = window.getComputedStyle(forSaleTxt);
                var referenceFontSize = parseFloat(computedStyle.getPropertyValue('font-size'));


                var desiredFontSize = calculateFontSizeToMatchWidth(referenceText, targetText, referenceFontSize);


                // Apply the desired font size to the target text
                userInput.style.fontSize = `${desiredFontSize}px`;
                userInput.style.cssText += `font-size: ${desiredFontSize}px;`;





            }
        } else if (inputField === 'phone') {
            console.log(userInput.value.length);

            if (userInput.value.length >= 7) {




                console.log("phone");
                var referenceText = forSaleTxt.textContent;
                var targetText = userInput.value;
                const computedStyle = window.getComputedStyle(forSaleTxt);
                var referenceFontSize = parseFloat(computedStyle.getPropertyValue('font-size'));


                var desiredFontSize = calculateFontSizeToMatchWidth(referenceText, targetText, referenceFontSize);


                // Apply the desired font size to the target text
                userInput.style.fontSize = `${desiredFontSize}px`;




            } else {


                console.log("phone - fall back");
                var referenceText = forSaleTxt.textContent;
                var targetText = "555-555-5555";
                const computedStyle = window.getComputedStyle(forSaleTxt);
                var referenceFontSize = parseFloat(computedStyle.getPropertyValue('font-size'));


                var desiredFontSize = calculateFontSizeToMatchWidth(referenceText, targetText, referenceFontSize);


                // Apply the desired font size to the target text
                userInput.style.fontSize = `${desiredFontSize}px`;
               // userInput.style.cssText += `font-size: ${desiredFontSize}px;`;




            }
        }

   

        if (userInput.value.length != 0) {
            console.log('normal');
            // this.style.maxWidth = Math.max(this.value.length) + "ch";
            console.log('anser: ' + userInput.value.length + "ch");
            console.log((Math.max(userInput.value.length, userInput.placeholder.length) - 2));
            console.log((Math.max(userInput.value.length, userInput.placeholder.length)));
            //this.maxWidth = this.length + "ch";

            const fontSizeInPx = 16; // Hardcoded font size in pixels
            userInput.style.width = (userInput.value.length * fontSizeInPx / 16) + "ch";
            //userInput.style.width = (Math.max(userInput.value.length) ) + "ch";

        } else if (userInput.placeholder.length != 0) {
            console.log('placeholder');
            console.log(userInput.placeholder);
            userInput.style.width = (Math.max(userInput.placeholder.length)) + "ch";

            
        }
        //adjustSpaceFontSize();
    }
  }
  function calculateFontSizeToMatchWidth(referenceText, targetTextValue, referenceFontSize) {
    // Access the value of the input box
    var referenceWidth = getTextWidth(referenceText, referenceFontSize);
    const ghostSpaceWidth = getTextWidth('a', referenceFontSize);
    const spaceWidth = getTextWidth('a', 20);
    console.log(`${referenceWidth} | ${spaceWidth} | ${ghostSpaceWidth}`);
    referenceWidth = (referenceWidth - ghostSpaceWidth) + spaceWidth;

    const targetWidth = getTextWidth(targetTextValue, referenceFontSize);
    const desiredFontSize = ((referenceFontSize * referenceWidth) / targetWidth);


    return desiredFontSize;
}

function getTextWidth(text, fontSize) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    //context.font = `${fontSize}px Arial`;
    context.font = `${fontSize}px  Montserrat, sans-serif`;

    return context.measureText(text).width;
}



// =============================================================================
// Script 3
// =============================================================================


// JavaScript to randomize the order of review cards
function shuffleReviewCards() {
  var hiddenCards = 2;
  const reviewContainer = document.getElementById("review-container");
  const reviewCards = reviewContainer.querySelectorAll(".review-card");

  // Convert NodeList to an array for easier manipulation
  const cardsArray = Array.from(reviewCards);

  // Shuffle the array
  for (let i = cardsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
  }

  // Clear the existing cards
  reviewContainer.innerHTML = "";

  // Append the shuffled cards back to the container
  cardsArray.slice(0, -hiddenCards).forEach((card) => {
    reviewContainer.appendChild(card);
  });
}

// Call the function to shuffle review cards
shuffleReviewCards();

const reviewContainer = document.getElementById("review-container");
const reviewSection = document.getElementById("review-section");
let isScrolling = false;

reviewSection.addEventListener("mouseenter", () => {
isScrolling = true;
});

reviewSection.addEventListener("mouseleave", () => {
isScrolling = false;
reviewContainer.style.overflowY = "hidden"; // Reset overflowY to "hidden" when not scrolling
});

// Define a factor to control the scroll speed (adjust as needed)
const scrollSpeedFactor = 0.5; // Adjust this value for slower or faster scrolling

// Handle scroll events
reviewSection.addEventListener("wheel", (e) => {
if (isScrolling) {
const containerWidth =
  reviewContainer.scrollWidth - reviewContainer.clientWidth;
if (e.deltaY < 0 && reviewContainer.scrollLeft <= 0) {
  // If scrolling up at the start, allow page scroll
  reviewContainer.style.overflowY = "auto";
} else if (
  e.deltaY > 0 &&
  reviewContainer.scrollLeft >=
    containerWidth - containerWidth * 0.095
) {
  // If scrolling down at the end, allow page scroll
  reviewContainer.style.overflowY = "auto";
} else {
  e.preventDefault(); // Prevent default page scroll

  // Scroll horizontally with slower speed
  reviewContainer.style.overflowY = "hidden"; // Prevent page scroll while hovering
  reviewContainer.scrollLeft += e.deltaY * scrollSpeedFactor;
}
}
});

// =============================================================================
// Script 4
// =============================================================================



// Function to set a cookie
function setVisitedCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // Function to get the value of a cookie by name
    function getVisitedCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    // Check if the 'visited' cookie exists
  

    var forSaleTxts = document.querySelectorAll('.sticker-for-sale');
    forSaleTxts.forEach(function (forSaleTxt) {
        forSaleTxt.addEventListener("click", () => {
        var visitedCookie = getVisitedCookie("visited");
          if (visitedCookie === "") {
          // If the 'visited' cookie doesn't exist, set it and perform actions for first-time visitors
          setVisitedCookie("visited", "true", 1); // Set the cookie to expire in 365 days

          // Actions for first-time visitors
        // alert("Welcome! It's your first time visiting this site.");
        displayHelpPopup();
        
        } else {
          // Actions for returning visitors
          //alert("Welcome back!");
        }
      });
    });

    
  

   

    function displayHelpPopup() {
      var popupContainer = document.getElementById("popup-container");
      var popupContent = document.getElementById("popup-content");
      popupContainer.style.display = "flex";
      var firstChild = popupContent.firstChild;
/*
      // Create and append the iframe
      var iframe = document.createElement("iframe");
      iframe.src = "terms-of-service.html";
      iframe.id = "iframe-container";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("width", "100%");
      iframe.setAttribute("height", "100%");



      popupContent.insertBefore(iframe, firstChild);
      */

   
    }


    function showHelp() {
      displayHelpPopup();
    }


    function closePopup() {
   
      document.getElementById("popup-content").classList.add("close-animation");

      setTimeout(function() {
 
      var popupContainer = document.getElementById("popup-container");
      //var popupContent = document.getElementById("popup-content");

      
      document.getElementById("popup-content").classList.remove("close-animation");


      popupContainer.style.display = "none";

    }, 400);
    }

   // Function to check if an element is in the viewport with a tolerance
   function isElementInViewport(el, tolerance = 0) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top - tolerance <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left - tolerance <= (window.innerWidth || document.documentElement.clientWidth) &&
      rect.bottom + tolerance >= 0 &&
      rect.right + tolerance >= 0
    );
  }
  function isScrollWithinDistances(distFromTop, distFromBottom) {
    var totalHeight = document.documentElement.scrollHeight;
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    var scrollPosition = window.scrollY || window.pageYOffset;

    var fromTop = (scrollPosition / totalHeight) * 100; // Percentage from the top
    var fromBottom = ((totalHeight - scrollPosition - windowHeight) / totalHeight) * 100; // Percentage from the bottom

    return fromTop <= distFromTop || fromBottom <= distFromBottom;
}



  // Function to handle the visibility of the button
  function handleButtonVisibility() {
    var stickerBuilders = document.querySelectorAll('.sticker-builder');
    var helpButton = document.getElementById('helpButton');

    // Check if any sticker-builder is in view with increased tolerance (e.g., 20 pixels)
    var isAnyStickerBuilderInView = Array.from(stickerBuilders).some(el => isElementInViewport(el, 20));

    var isAnyStickerBuilderInView = Array.from(stickerBuilders).some(el => isScrollWithinDistances( 10, 10));

    console.log(isAnyStickerBuilderInView);
    if(isAnyStickerBuilderInView && isAnyStickerBuilderInView) {
 // Show or hide the button based on the result

    helpButton.style.display = isAnyStickerBuilderInView ? 'block' : 'none';
    } else {
      helpButton.style.display = "none";
    }

    adjustButtonPosition();
  }


 

var scrollTimer;
  function adjustButtonPosition() {
    var helpButton = document.getElementById('helpButton');
    helpButton.style.bottom = '20px';
    clearTimeout(scrollTimer);
    
   
    
    const distanceFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight;

    var footer = document.querySelector('footer');


    var footerHeight = footer.offsetHeight;
   
    
    if (distanceFromBottom <= footerHeight ) {
   
    
      helpButton.style.bottom = `${footerHeight - distanceFromBottom + 20}px`; // 20px is the original bottom value
    } else {
      helpButton.style.bottom = '20px';
    }

    scrollTimer = setTimeout(() => {
    // This code will run after the user stops scrolling for a certain duration
    adjustButtonPosition();
  }, 0.05); // Adjust the duration as needed
  

  

    
  } 

  

    // Attach the adjustButtonPosition function to the window scroll event

 
    window.addEventListener('scroll', handleButtonVisibility);
    window.addEventListener('touch', handleButtonVisibility);
   

  // Attach the handleButtonVisibility function to scroll and resize events
  window.addEventListener('scroll', handleButtonVisibility);
  window.addEventListener('resize', handleButtonVisibility);

  // Initial check when the page loads
  handleButtonVisibility();

