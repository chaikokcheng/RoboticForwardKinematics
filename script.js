// Forward Kinematics Simulator
// 2-link planar robot arm visualization with Inverse Kinematics

const canvas = document.getElementById('robotCanvas');
const ctx = canvas.getContext('2d');

// Get control elements
const theta1Slider = document.getElementById('theta1');
const theta2Slider = document.getElementById('theta2');
const link1Slider = document.getElementById('link1');
const link2Slider = document.getElementById('link2');
const resetBtn = document.getElementById('resetBtn');
const animateBtn = document.getElementById('animateBtn');

// IK control elements
const targetXSlider = document.getElementById('targetX')
const targetYSlider = document.getElementById('targetY');
const solveIKBtn = document.getElementById('solveIKBtn');

// Display elements
const theta1Value = document.getElementById('theta1Value');
const theta2Value = document.getElementById('theta2Value');
const link1Value = document.getElementById('link1Value');
const link2Value = document.getElementById('link2Value');
const endX = document.getElementById('endX');
const endY = document.getElementById('endY');

// IK display elements
const targetXValue = document.getElementById('targetXValue');
const targetYValue = document.getElementById('targetYValue');
const ikResult = document.getElementById('ikResult');
const ikTheta1 = document.getElementById('ikTheta1');
const ikTheta2 = document.getElementById('ikTheta2');
const ikStatus = document.getElementById('ikStatus');

// Robot parameters
let theta1 = 0; // Joint 1 angle in degrees
let theta2 = 0; // Joint 2 angle in degrees
let link1Length = 150; // Link 1 length in pixels
let link2Length = 120; // Link 2 length in pixels

// Target position for IK
let targetX = 200;
let targetY = 150;
let showTarget = false;

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
    
    // IK event listeners
    targetXSlider.addEventListener('input', () => {
        targetX = parseFloat(targetXSlider.value);
        targetXValue.textContent = targetX;
        showTarget = true;
        drawRobot();
    });
    
    targetYSlider.addEventListener('input', () => {
        targetY = parseFloat(targetYSlider.value);
        targetYValue.textContent = targetY;
        showTarget = true;
        drawRobot();
    });
    
    resetBtn.addEventListener('click', resetRobot);
    animateBtn.addEventListener('click', toggleAnimation);
    solveIKBtn.addEventListener('click', solveInverseKinematics);
}

// Update display values
function updateDisplay() {
    theta1Value.textContent = Math.round(theta1);
    theta2Value.textContent = Math.round(theta2);
    link1Value.textContent = link1Length;
    link2Value.textContent = link2Length;
    
    // Calculate end-effector position
    const theta1Rad = theta1 * Math.PI / 180;
    const theta2Rad = theta2 * Math.PI / 180;
    
    const x = link1Length * Math.cos(theta1Rad) + link2Length * Math.cos(theta1Rad + theta2Rad);
    const y = link1Length * Math.sin(theta1Rad) + link2Length * Math.sin(theta1Rad + theta2Rad);
    
    endX.textContent = x.toFixed(2);
    endY.textContent = y.toFixed(2);
}

// Solve Inverse Kinematics
function solveInverseKinematics() {
    showTarget = true;
    const x = targetX;
    const y = targetY;
    const L1 = link1Length;
    const L2 = link2Length;
    
    // Calculate distance to target
    const distance = Math.sqrt(x * x + y * y);
    const maxReach = L1 + L2;
    const minReach = Math.abs(L1 - L2);
    
    // Check if target is reachable
    if (distance > maxReach || distance < minReach) {
        ikResult.style.display = 'block';
        ikTheta1.textContent = '--';
        ikTheta2.textContent = '--';
        ikStatus.textContent = '❌ Target unreachable! Distance: ' + distance.toFixed(2) + 'px, Max reach: ' + maxReach + 'px';
        ikStatus.style.color = '#dc3545';
        drawRobot();
        return;
    }
    
    // Calculate theta2 using law of cosines
    const cosTheta2 = (x * x + y * y - L1 * L1 - L2 * L2) / (2 * L1 * L2);
    const theta2Rad = Math.acos(Math.max(-1, Math.min(1, cosTheta2))); // Elbow down configuration
    
    // Calculate theta1
    const k1 = L1 + L2 * cosTheta2;
    const k2 = L2 * Math.sin(theta2Rad);
    const theta1Rad = Math.atan2(y, x) - Math.atan2(k2, k1);
    
    // Convert to degrees
    const newTheta1 = theta1Rad * 180 / Math.PI;
    const newTheta2 = theta2Rad * 180 / Math.PI;
    
    // Update sliders and values
    theta1 = newTheta1;
    theta2 = newTheta2;
    theta1Slider.value = theta1;
    theta2Slider.value = theta2;
    
    // Display IK results
    ikResult.style.display = 'block';
    ikTheta1.textContent = newTheta1.toFixed(2);
    ikTheta2.textContent = newTheta2.toFixed(2);
    ikStatus.textContent = '✅ Solution found! (Elbow-down configuration)';
    ikStatus.style.color = '#28a745';
    
    updateDisplay();
    drawRobot();
}

// Draw the robot arm
function drawRobot() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid();
    
    // Draw workspace circle (reachable area)
    drawWorkspace();
    
    // Draw target point if IK is being used
    if (showTarget) {
        drawTarget();
    }
    
    // Convert angles to radians
    const theta1Rad = theta1 * Math.PI / 180;
    const theta2Rad = theta2 * Math.PI / 180;
    
    // Calculate joint positions
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

// Draw target point
function drawTarget() {
    const targetScreenX = baseX + targetX;
    const targetScreenY = baseY - targetY; // Invert Y for screen coordinates
    
    // Draw target crosshair
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(targetScreenX - 15, targetScreenY);
    ctx.lineTo(targetScreenX + 15, targetScreenY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(targetScreenX, targetScreenY - 15);
    ctx.lineTo(targetScreenX, targetScreenY + 15);
    ctx.stroke();
    
    // Draw target circle
    ctx.beginPath();
    ctx.arc(targetScreenX, targetScreenY, 8, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw label
    ctx.fillStyle = '#28a745';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Target (' + targetX + ', ' + targetY + ')', targetScreenX + 15, targetScreenY - 10);
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
    showTarget = false;
    
    theta1Slider.value = theta1;
    theta2Slider.value = theta2;
    link1Slider.value = link1Length;
    link2Slider.value = link2Length;
    
    ikResult.style.display = 'none';
    
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
