const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorInput = document.getElementById('color');
const thicknessInput = document.getElementById('thickness');
const eraserSizeInput = document.getElementById('eraserSize');
const clearButton = document.getElementById('clear');
const eraserButton = document.getElementById('eraser');
const bgColorInput = document.getElementById('bgColor');
const submitButton = document.getElementById('submit');
const ratingContainer = document.getElementById('rating-container');
const ratingDisplay = document.getElementById('rating');

let painting = false;
let erasing = false;
let currentColor = "#000000";
let currentThickness = 5;
let eraserSize = 20;
let canvasBgColor = "#ffffff";
let drawingMode = 'free'; // Modes: free, rectangle, circle
let history = [];
let historyIndex = -1;

canvas.style.backgroundColor = canvasBgColor;

let startX = 0, startY = 0;

function saveState() {
    history = history.slice(0, historyIndex + 1); // Remove redo states
    history.push(canvas.toDataURL());
    historyIndex++;
}

function restoreState() {
    const img = new Image();
    img.src = history[historyIndex];
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

canvas.addEventListener('mousedown', (e) => {
    painting = true;
    [startX, startY] = getMousePosition(e);
    if (!erasing && drawingMode === 'free') saveState();
});

canvas.addEventListener('mouseup', (e) => {
    painting = false;
    if (drawingMode !== 'free' && !erasing) {
        drawShape(e);
        saveState();
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (painting && drawingMode === 'free') {
        if (erasing) {
            erase(e);
        } else {
            draw(e);
        }
    }
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasBgColor = "#ffffff";
    setCanvasBackground();
    saveState();
});

eraserButton.addEventListener('click', () => {
    erasing = !erasing;
    eraserButton.classList.toggle('active', erasing);
});

colorInput.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

thicknessInput.addEventListener('input', (e) => {
    currentThickness = e.target.value;
});

eraserSizeInput.addEventListener('input', (e) => {
    eraserSize = e.target.value;
});

bgColorInput.addEventListener('input', (e) => {
    canvasBgColor = e.target.value;
    setCanvasBackground();
    saveState();
});

function draw(e) {
    const [x, y] = getMousePosition(e);
    ctx.lineWidth = currentThickness;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function erase(e) {
    const [x, y] = getMousePosition(e);
    ctx.clearRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
}

function drawShape(e) {
    const [endX, endY] = getMousePosition(e);
    ctx.lineWidth = currentThickness;
    ctx.strokeStyle = currentColor;
    ctx.beginPath();
    if (drawingMode === 'rectangle') {
        ctx.rect(startX, startY, endX - startX, endY - startY);
    } else if (drawingMode === 'circle') {
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    }
    ctx.stroke();
}

function setCanvasBackground() {
    ctx.fillStyle = canvasBgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
}

// Undo/Redo functionality
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z' && historyIndex > 0) {
        historyIndex--;
        restoreState();
    } else if (e.ctrlKey && e.key === 'y' && historyIndex < history.length - 1) {
        historyIndex++;
        restoreState();
    }
});

// Buttons to change drawing mode
document.getElementById('rectangle').addEventListener('click', () => drawingMode = 'rectangle');
document.getElementById('circle').addEventListener('click', () => drawingMode = 'circle');
document.getElementById('freeDraw').addEventListener('click', () => drawingMode = 'free');

submitButton.addEventListener('click', () => {
    // Capture the canvas as an image data URL
    const drawingData = canvas.toDataURL();

    // Call the AI function to rate the drawing (for now, we'll simulate it)
    const rating = simulateAIDrawingRating();
    
    // Show the rating in the UI
    ratingDisplay.textContent = rating;
    ratingContainer.style.display = 'block';
});

// Simulated AI Drawing Rating (returns a random rating between 1 and 100)
function simulateAIDrawingRating() {
    return Math.floor(Math.random() * 100) + 1;
}

// Initial setup for buttons, colors, and thickness
document.getElementById('color').addEventListener('input', (e) => {
    currentColor = e.target.value;
});

document.getElementById('thickness').addEventListener('input', (e) => {
    currentThickness = e.target.value;
});