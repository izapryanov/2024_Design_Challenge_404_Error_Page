function goHome() {
    window.location.href = "https://github.com/izapryanov/"; // Replace with your home page URL
}

document.addEventListener("DOMContentLoaded", function () {
    const carImage = document.getElementById("car-image");
    const carSound = document.getElementById("car-sound");

    // Trigger animation and sound on page load
    carSound.play();

    carImage.animate([
        { transform: 'translateX(0px)' },
        { transform: 'translateX(100vw)' } // Moves across the screen
    ], {
        duration: 3000, // Adjust speed
        easing: 'ease-in-out'
    });
});
