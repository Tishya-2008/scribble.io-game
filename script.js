const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorInput = document.getElementById('color');
const thicknessInput = document.getElementById('thickness');
const eraserSizeInput = document.getElementById('eraserSize');
const clearButton = document.getElementById('clear');
const eraserButton = document.getElementById('eraser');
const bgColorInput = document.getElementById('bgColor');

let painting = false;
let erasing = false;
let currentColor = "#000000";
let currentThickness = 5;
let eraserSize = 20; 
let canvasBgColor = "#ffffff";

canvas.style.backgroundColor = canvasBgColor;

let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (e) => {
    painting = true;
    [lastX, lastY] = getMousePosition(e);
    if (erasing) erase(e); 
});

canvas.addEventListener('mouseup', () => {
    painting = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', (e) => {
    if (painting) {
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

    [lastX, lastY] = [x, y];
}

function erase(e) {
    const [x, y] = getMousePosition(e);
    ctx.clearRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
}

function setCanvasBackground() {
    ctx.fillStyle = canvasBgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
}