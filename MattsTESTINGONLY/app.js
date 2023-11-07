import UIManager, { Button } from './UIManager.js';


const uiManager = new UIManager();
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

let hoveredButton = null;
let activeButton = null;


//calling logic in UI manager Class for mouse movments and clicks
canvas.addEventListener('click', uiManager.handleClick.bind(uiManager));
canvas.addEventListener('mousemove', uiManager.handleMouseMove.bind(uiManager));
canvas.addEventListener('mousedown', uiManager.handleMouseDown.bind(uiManager));
canvas.addEventListener('mouseup', uiManager.handleMouseUp.bind(uiManager));
uiManager.songInput.addEventListener('change', uiManager.handleSongInput.bind(uiManager));


//the loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all buttons (with hover and active states) and the timer
   // uiManager.drawAll(ctx, canvas.width, canvas.height, hoveredButton, activeButton);
    uiManager.drawAll(ctx, canvas.width, canvas.height, uiManager.hoveredButton, uiManager.activeButton);


    requestAnimationFrame(animate);
}


animate();
