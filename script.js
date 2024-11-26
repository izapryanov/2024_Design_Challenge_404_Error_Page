 document.addEventListener("DOMContentLoaded", () => {
    const car = document.getElementById('car');
    let isBackgroundImageLoaded = false;
    const background = document.getElementById('background');

    // Logical positions of the points
    const blackDotPosition = { x: 0.42, y: 0.71 }; // Start position
    const blueDotPosition = { x: 0.49, y: 0.68 };  // End position

    let currentTargetPosition = blackDotPosition; // Tracks the car's current logical position

    background.onload = () => {
        isBackgroundImageLoaded = true;
    };

    // Function to calculate and set car position
    function calculateCarPosition(dotPosition) {
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
    function animateCar(start, end, duration, startSize, endSize) {
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
                currentTargetPosition = blueDotPosition;
                // Recalculate position after the animation to prevent "dancing"
                const finalPosition = calculateCarPosition(currentTargetPosition);
                car.style.left = `${finalPosition.left}px`;
                car.style.top = `${finalPosition.top}px`;
                car.style.width = `${endSize}%`; // Ensure the final size is set
            }
        }

        requestAnimationFrame(update);
    }

    // Function to handle resizing
    function onResize() {
        const updatedPosition = calculateCarPosition(currentTargetPosition);
        car.style.left = `${updatedPosition.left}px`;
        car.style.top = `${updatedPosition.top}px`;
    }

    // Set initial position at black dot
    const startPosition = calculateCarPosition(blackDotPosition);
    const endPosition = calculateCarPosition(blueDotPosition);

    car.style.left = `${startPosition.left}px`;
    car.style.top = `${startPosition.top}px`;

    async function startAnimation() {
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (isBackgroundImageLoaded) {
                    clearInterval(interval); // Stop checking
                    resolve(); // Resolve the promise
                }
            }, 100); // Check every 100ms
        });
        car.src = "resources/car_watercolor_border.png";
        animateCar(startPosition, endPosition, 5000, 5, 40); // 5000 mseconds, scale from 5% to 20%
    }

    // function startAnimation() {
    //      animateCar(startPosition, endPosition, 5000, 5, 40); // 5000 mseconds, scale from 5% to 20%
    // }
    startAnimation();

    // Trigger the animation when the button is clicked
    document.getElementById('replay-btn').addEventListener('click',  () => {
        const audio = document.getElementById('background-audio');
        audio.currentTime = 0;
        audio.play();
        startAnimation();
    });
    
    // Recalculate positions on window resize
    window.addEventListener('resize', onResize);
});

//Change car image on hover
function swapImage(isHover) {
    const img = document.getElementById('car');
    img.src = (isHover ? 'resources/car_watercolor_border_hover.png' : 'resources/car_watercolor_border.png');
}

// Get the audio element and the button
const audio = document.getElementById('background-audio');
const muteUnmuteButton = document.getElementById('mute-unmute-btn');

document.getElementById('mute-unmute-btn').addEventListener('click',  () => {
    if (audio.muted) {
        audio.muted = false; // Unmute the audio
        muteUnmuteButton.textContent = 'Mute'; // Change button text
    } else {
        audio.muted = true; // Mute the audio
        muteUnmuteButton.textContent = 'Unmute'; // Change button text
    }
});
