// Logical positions of the points
const greenDotPosition = { x: 0.42, y: 0.71 }; // Start position
const blueDotPosition = { x: 0.49, y: 0.68 };  // End position
let isFirstCheckForLoadedImages = true;

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
function onResize(background, currentTargetPosition) {
    const updatedPosition = calculateCarPosition(currentTargetPosition, background);
    let car = document.getElementById('car');
    car.style.left = `${updatedPosition.left}px`;
    car.style.top = `${updatedPosition.top}px`;
}

// Change car image on hover
function swapImage(isHover) {
    let img = document.getElementById('car');
    isFirstCheckForLoadedImages = false;
    img.src = isHover
        ? 'resources/car_watercolor_border_hover.png'
        : 'resources/car_watercolor_border.png';
}

//Load and add car image to the scene
function addCarImage(left, top){
     // Create the anchor element
     const anchor = document.createElement('a');
     anchor.href = "https://en.wikipedia.org/wiki/Peugeot_404"; // Set the link
     anchor.target = "_blank"; // Open in a new tab

    // Create the image element
    let carImage = document.createElement('img');

    // Set the attributes
    carImage.src = "resources/car_watercolor_border.png";
    carImage.className = "car";
    carImage.id = "car";
    carImage.alt = "Car";
    carImage.style.left = left;
    carImage.style.top = top;

    // Attach event listeners for hover
    carImage.addEventListener('mouseover', () => swapImage(true));
    carImage.addEventListener('mouseout', () => swapImage(false));

    // Append the image to the anchor
    anchor.appendChild(carImage);

    // Append the image to a desired container
    const container = document.getElementById('container');
    container.appendChild(anchor);

    return carImage;
}


document.addEventListener("DOMContentLoaded", () => {
    let background = document.getElementById('background');
    let currentTargetPosition = greenDotPosition; // Tracks the car's current logical position

    // Callback to execute when both car and background images are loaded
    function carAndBackgroundLoaded(callback) {
        // Wait for the background image to load
        background.addEventListener('load', () => {
            console.log("Background image loaded.");
            
            // Ensure the dimensions of the background are accurate
            const startPosition = calculateCarPosition(greenDotPosition, background);
            const carLeft = `${startPosition.left}px`;
            const carTop = `${startPosition.top}px`;

            let carImage = addCarImage(carLeft, carTop);

            // Wait for the car image to load
            carImage.addEventListener('load', () => {
                console.log("Car image loaded.");
                if (isFirstCheckForLoadedImages) { // Prevent constant re-triggering
                    callback(); // Trigger the animation or further actions
                }
            });

            // Handle cached car image
            if (carImage.complete) {
                const event = new Event('load');
                carImage.dispatchEvent(event);
            }
        });

        // Handle cached background image
        if (background.complete) {
            const event = new Event('load');
            background.dispatchEvent(event);
        }
    }

    function startAnimation() {
        const startPosition = calculateCarPosition(greenDotPosition, background);
        const endPosition = calculateCarPosition(blueDotPosition, background);

        let car = document.getElementById('car');
        animateCar(car, background, startPosition, endPosition, 5000, 5, 40,
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

    carAndBackgroundLoaded(startAnimation);

    // Button to replay the animation
    document.getElementById('replay-btn').addEventListener('click', () => {
        const audio = document.getElementById('background-audio');
        audio.currentTime = 0;
        audio.play();
        startAnimation();
    });

    // Recalculate positions on window resize
    window.addEventListener('resize', () => onResize(background, currentTargetPosition));

    // Mute/Unmute button
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