// Forward Kinematics Simulator
// 2-link planar robot arm visualization

const canvas = document.getElementById('robotCanvas');
const ctx = canvas.getContext('2d');

// Get control elements
const theta1Slider = document.getElementById('theta1');
const theta2Slider = document.getElementById('theta2');
const link1Slider = document.getElementById('link1');
const link2Slider = document.getElementById('link2');
const resetBtn = document.getElementById('resetBtn');
const animateBtn = document.getElementById('animateBtn');

// Display elements
const theta1Value = document.getElementById('theta1Value');
const theta2Value = document.getElementById('theta2Value');
const link1Value = document.getElementById('link1Value');
const link2Value = document.getElementById('link2Value');
const endX = document.getElementById('endX');
const endY = document.getElementById('endY');

// Robot parameters
let theta1 = 0; // Joint 1 angle in degrees
let theta2 = 0; // Joint 2 angle in degrees
let link1Length = 150; // Link 1 length in pixels
let link2Length = 120; // Link 2 length in pixels

// Animation state
let isAnimating = false;
let animationFrame = 0;

// Base position (center of canvas)
let baseX = canvas.width / 2;
let baseY = canvas.height / 2;

// Initialize
function init() {
    updateDisplay();
    drawRobot();
    
    // Event listeners
    theta1Slider.addEventListener('input', () => {
        theta1 = parseFloat(theta1Slider.value);
        updateDisplay();
        drawRobot();
    });
    
    theta2Slider.addEventListener('input', () => {
        theta2 = parseFloat(theta2Slider.value);
        updateDisplay();
        drawRobot();
    });
    
    link1Slider.addEventListener('input', () => {
        link1Length = parseFloat(link1Slider.value);
        updateDisplay();
        drawRobot();
    });
    
    link2Slider.addEventListener('input', () => {
        link2Length = parseFloat(link2Slider.value);
        updateDisplay();
        drawRobot();
    });
    
    resetBtn.addEventListener('click', resetRobot);
    animateBtn.addEventListener('click', toggleAnimation);
}

// Update display values
function updateDisplay() {
    theta1Value.textContent = Math.round(theta1);
    theta2Value.textContent = Math.round(theta2);
    link1Value.textContent = link1Length;
    link2Value.textContent = link2Length;
    
    // Calculate end-effector position (Forward Kinematics)
    const theta1Rad = theta1 * Math.PI / 180;
    const theta2Rad = theta2 * Math.PI / 180;
    
    // X position = L1*cos(θ1) + L2*cos(θ1+θ2)
    const x = link1Length * Math.cos(theta1Rad) + link2Length * Math.cos(theta1Rad + theta2Rad);
    
    // Y position = L1*sin(θ1) + L2*sin(θ1+θ2)
    const y = link1Length * Math.sin(theta1Rad) + link2Length * Math.sin(theta1Rad + theta2Rad);
    
    endX.textContent = x.toFixed(2);
    endY.textContent = y.toFixed(2);
}

// Draw the robot arm
function drawRobot() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid();
    
    // Draw workspace circle (reachable area)
    drawWorkspace();
    
    // Convert angles to radians
    const theta1Rad = theta1 * Math.PI / 180;
    const theta2Rad = theta2 * Math.PI / 180;
    
    // Calculate joint positions using Forward Kinematics
    const joint1X = baseX + link1Length * Math.cos(theta1Rad);
    const joint1Y = baseY - link1Length * Math.sin(theta1Rad); // Invert Y for screen coordinates
    
    const endX_pos = baseX + link1Length * Math.cos(theta1Rad) + link2Length * Math.cos(theta1Rad + theta2Rad);
    const endY_pos = baseY - link1Length * Math.sin(theta1Rad) - link2Length * Math.sin(theta1Rad + theta2Rad);
    
    // Draw base
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(baseX, baseY, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw link 1
    ctx.strokeStyle = '#DC143C';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(joint1X, joint1Y);
    ctx.stroke();
    
    // Draw joint 1
    ctx.fillStyle = '#B71C1C';
    ctx.beginPath();
    ctx.arc(joint1X, joint1Y, 12, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw link 2
    ctx.strokeStyle = '#DC143C';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(joint1X, joint1Y);
    ctx.lineTo(endX_pos, endY_pos);
    ctx.stroke();
    
    // Draw end-effector
    ctx.fillStyle = '#dc3545';
    ctx.beginPath();
    ctx.arc(endX_pos, endY_pos, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('Base (0,0)', baseX - 30, baseY + 30);
    ctx.fillText('Joint 1', joint1X + 15, joint1Y);
    ctx.fillText('End-Effector', endX_pos + 15, endY_pos);
    
    // Draw coordinate axes
    drawAxes();
    
    // Draw angle labels
    ctx.fillStyle = '#28a745';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('θ₁ = ' + Math.round(theta1) + '°', baseX + 30, baseY - 5);
    ctx.fillStyle = '#ffc107';
    ctx.fillText('θ₂ = ' + Math.round(theta2) + '°', joint1X + 20, joint1Y - 15);
}

// Draw workspace (reachable area)
function drawWorkspace() {
    const maxReach = link1Length + link2Length;
    const minReach = Math.abs(link1Length - link2Length);
    
    // Draw max reach circle
    ctx.strokeStyle = 'rgba(220, 20, 60, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(baseX, baseY, maxReach, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw min reach circle (if applicable)
    if (minReach > 0) {
        ctx.beginPath();
        ctx.arc(baseX, baseY, minReach, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    ctx.setLineDash([]);
}

// Draw grid
function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Draw coordinate axes
function drawAxes() {
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(canvas.width, baseY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(baseX, 0);
    ctx.lineTo(baseX, canvas.height);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#999';
    ctx.font = '12px Arial';
    ctx.fillText('+X', canvas.width - 25, baseY - 5);
    ctx.fillText('-X', 5, baseY - 5);
    ctx.fillText('+Y', baseX + 5, 15);
    ctx.fillText('-Y', baseX + 5, canvas.height - 5);
}

// Reset robot to default position
function resetRobot() {
    theta1 = 0;
    theta2 = 0;
    link1Length = 150;
    link2Length = 120;
    
    theta1Slider.value = theta1;
    theta2Slider.value = theta2;
    link1Slider.value = link1Length;
    link2Slider.value = link2Length;
    
    updateDisplay();
    drawRobot();
}

// Toggle animation
function toggleAnimation() {
    isAnimating = !isAnimating;
    animateBtn.textContent = isAnimating ? 'Stop Animation' : 'Animate Movement';
    
    if (isAnimating) {
        animate();
    }
}

// Animation loop
function animate() {
    if (!isAnimating) return;
    
    animationFrame++;
    
    // Create smooth circular motion
    const time = animationFrame * 0.02;
    theta1 = Math.sin(time) * 60; // -60 to 60 degrees
    theta2 = Math.cos(time * 1.5) * 90; // -90 to 90 degrees
    
    theta1Slider.value = theta1;
    theta2Slider.value = theta2;
    
    updateDisplay();
    drawRobot();
    
    requestAnimationFrame(animate);
}

// Handle window resize
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = container.clientWidth - 32; // Account for padding
    const aspectRatio = 800 / 600;
    
    if (maxWidth < 800) {
        canvas.width = maxWidth;
        canvas.height = maxWidth / aspectRatio;
    } else {
        canvas.width = 800;
        canvas.height = 600;
    }
    
    // Update base position
    baseX = canvas.width / 2;
    baseY = canvas.height / 2;
    
    drawRobot();
}

window.addEventListener('resize', resizeCanvas);

// Initialize when page loads
init();
