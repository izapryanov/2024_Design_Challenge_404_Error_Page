function goHome() {
    window.location.href = "https://github.com/izapryanov/"; //Open my home page on github
}

function openNewformChallengeURL() {
    window.open("https://www.newform.community/challenge",'_blank'); //Open challenge url func
}

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
