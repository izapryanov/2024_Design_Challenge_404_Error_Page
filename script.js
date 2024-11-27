// Logical positions of the points
const blackDotPosition = { x: 0.42, y: 0.71 }; // Start position
const blueDotPosition = { x: 0.49, y: 0.68 };  // End position

// Function to calculate and set car position
function calculateCarPosition(dotPosition, background) {
    const bgRect = background.getBoundingClientRect();
    const imgNaturalWidth = background.naturalWidth;
    const imgNaturalHeight = background.naturalHeight;

    // Calculate aspect ratio and visible area
    const bgAspectRatio = imgNaturalWidth / imgNaturalHeight;
    const containerAspectRatio = bgRect.width / bgRect.height;

    let visibleWidth, visibleHeight;
    let offsetX = 0, offsetY = 0;

    if (containerAspectRatio > bgAspectRatio) {
        // Image is fully visible vertically; sides are cropped
        visibleHeight = bgRect.height;
        visibleWidth = bgRect.height * bgAspectRatio;
        offsetX = (bgRect.width - visibleWidth) / 2;
    } else {
        // Image is fully visible horizontally; top and bottom are cropped
        visibleWidth = bgRect.width;
        visibleHeight = bgRect.width / bgAspectRatio;
        offsetY = (bgRect.height - visibleHeight) / 2;
    }

    // Calculate car's position relative to visible background
    const carLeft = offsetX + dotPosition.x * visibleWidth;
    const carTop = offsetY + dotPosition.y * visibleHeight;

    return { left: carLeft, top: carTop };
}

// Function to generate random vibration offsets
function generateRandomVibration() {
    return Math.random() * 4 - 2; // Random number between -2 and 2 (shaking effect)
}

// Smooth animation function
function animateCar(car, background, start, end, duration, startSize, endSize, currentTargetPosition, onComplete) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Ensure progress is capped at 1

        // Interpolate positions
        const currentLeft = start.left + (end.left - start.left) * progress;
        const currentTop = start.top + (end.top - start.top) * progress;

        // Interpolate size
        const currentSize = startSize + (endSize - startSize) * progress;

        // Apply trembling effect while the animation is running
        const trembleLeft = currentLeft + generateRandomVibration();
        const trembleTop = currentTop + generateRandomVibration();

        // Update car position and size
        car.style.left = `${trembleLeft}px`;
        car.style.top = `${trembleTop}px`;
        car.style.width = `${currentSize}%`;

        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Animation complete, update the car's logical position
            onComplete(end);
        }
    }

    requestAnimationFrame(update);
}

// Function to handle resizing
function onResize(car, background, currentTargetPosition) {
    const updatedPosition = calculateCarPosition(currentTargetPosition, background);
    car.style.left = `${updatedPosition.left}px`;
    car.style.top = `${updatedPosition.top}px`;
}

// Change car image on hover
function swapImage(isHover) {
    const img = document.getElementById('car');
    img.src = isHover
        ? 'resources/car_watercolor_border_hover.png'
        : 'resources/car_watercolor_border.png';
}


document.addEventListener("DOMContentLoaded", () => {
    const car = document.getElementById('car');
    const background = document.getElementById('background');

    let currentTargetPosition = blackDotPosition; // Tracks the car's current logical position

    // Set initial position at black dot
    const startPosition = calculateCarPosition(blackDotPosition, background);
    const endPosition = calculateCarPosition(blueDotPosition, background);

    car.style.left = `${startPosition.left}px`;
    car.style.top = `${startPosition.top}px`;

    //Callback to execute when the car and the background images are loaded
    function carAndBackgroundLoaded(carImage, backgroundImage, callback) {
        let isCarImageLoaded = false;
        let isBackgroundImageLoaded = false;

        function imageLoaded() {
            if (isCarImageLoaded && isBackgroundImageLoaded) {
                callback(); // Once both images are loaded, execute the callback
            }
        }    

        // Check if images are already loaded (in case they are cached)
        if (carImage.complete && backgroundImage.complete) {
            isCarImageLoaded = true;
            isBackgroundImageLoaded = true;
            imageLoaded();
        } else {
            // Add event listeners for both images
            carImage.addEventListener('load',  () => {
                isCarImageLoaded = true;
                imageLoaded();
            });
            backgroundImage.addEventListener('load',  () => {
                isBackgroundImageLoaded = true;
                imageLoaded();
            });
        }
    }

    function startAnimation() {
        animateCar(car,background,startPosition,endPosition,5000,5,40,
            currentTargetPosition,
            (newPosition) => {
                currentTargetPosition = newPosition;
                const finalPosition = calculateCarPosition(currentTargetPosition, background);
                car.style.left = `${finalPosition.left}px`;
                car.style.top = `${finalPosition.top}px`;
                car.style.width = '40%'; // Ensure the final size is set
            }
        );
    }
    carAndBackgroundLoaded(car, background, startAnimation);

    // Trigger the animation when the button is clicked
    document.getElementById('replay-btn').addEventListener('click', () => {
        const audio = document.getElementById('background-audio');
        audio.currentTime = 0;
        audio.play();
        startAnimation();
    });

    // Recalculate positions on window resize
    window.addEventListener('resize', () => onResize(car, background, currentTargetPosition));

    // Get the audio element and the button
    const audio = document.getElementById('background-audio');
    const muteUnmuteButton = document.getElementById('mute-unmute-btn');

    muteUnmuteButton.addEventListener('click', () => {
        if (audio.muted) {
            audio.muted = false; // Unmute the audio
            muteUnmuteButton.textContent = 'Mute'; // Change button text
        } else {
            audio.muted = true; // Mute the audio
            muteUnmuteButton.textContent = 'Unmute'; // Change button text
        }
    });
});
