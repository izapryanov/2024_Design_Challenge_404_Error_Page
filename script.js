
document.addEventListener("DOMContentLoaded", function () {
    const carImage = document.getElementById("car-image");
    // const carSound = document.getElementById("car-sound");
    console.log(carImage);
    // Trigger animation and sound on page load
    // carSound.play();

    carImage.animate([
        // { transform: 'translateX(0px)' },
        // { transform: 'translateX(100vw)' } // Moves across the screen
    ], {
        // duration: 3000, // Adjust speed
        // easing: 'ease-in-out'
    });
});
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    debugMode = urlParams.get('debug') === 'true';
    if (debugMode) {
      enableDebug();
    }
  };

  function toggleDebugMode() {
    debugMode = !debugMode;
    if (debugMode) {
      enableDebug();
    } else {
      disableDebug();
    }
  }
  
  function enableDebug() {
    console.log("Debug mode ON");
    document.body.classList.add("debug-on");
    // Add other JavaScript debugging features here
    // e.g., activate verbose logging, special styling, etc.
  }
  
  function disableDebug() {
    console.log("Debug mode OFF");
    document.body.classList.remove("debug-on");
    // Disable debugging features here
  }
  
