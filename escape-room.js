/**
 * 🔐 Robot Lab Escape - Forward Kinematics Challenge
 * SCARA Robot Arm Simulation with a1=1.0, a2=0.8
 * 3 Fixed Questions Version
 */

// ==========================================
// Robot Arm Configuration (matches Python)
// ==========================================
const ROBOT = {
    a1: 1.0,  // Link 1 length
    a2: 0.8,  // Link 2 length
    maxReach: 1.8,  // a1 + a2
    minReach: 0.2   // |a1 - a2|
};

// ==========================================
// Fixed Questions Configuration
// ==========================================
const QUESTIONS = [
    { theta1: 45, theta2: 30 },   // Question 1
    { theta1: -30, theta2: 60 },  // Question 2
    { theta1: 90, theta2: -45 }   // Question 3
];

// ==========================================
// Game State
// ==========================================
const gameState = {
    currentRoom: 0,
    startTime: null,
    totalAttempts: 0,
    questions: QUESTIONS.map(q => ({
        ...q,
        correctX: 0,
        correctY: 0
    }))
};

// ==========================================
// Utility Functions
// ==========================================
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

// Forward Kinematics (matches Python implementation)
function forwardKinematics(theta1Deg, theta2Deg) {
    const theta1 = degToRad(theta1Deg);
    const theta2 = degToRad(theta2Deg);
    
    const x = ROBOT.a1 * Math.cos(theta1) + ROBOT.a2 * Math.cos(theta1 + theta2);
    const y = ROBOT.a1 * Math.sin(theta1) + ROBOT.a2 * Math.sin(theta1 + theta2);
    
    return { x, y };
}

// Get all joint positions
function getJointPositions(theta1Deg, theta2Deg) {
    const theta1 = degToRad(theta1Deg);
    const theta2 = degToRad(theta2Deg);
    
    const x0 = 0, y0 = 0;
    const x1 = ROBOT.a1 * Math.cos(theta1);
    const y1 = ROBOT.a1 * Math.sin(theta1);
    const x2 = x1 + ROBOT.a2 * Math.cos(theta1 + theta2);
    const y2 = y1 + ROBOT.a2 * Math.sin(theta1 + theta2);
    
    return { base: {x: x0, y: y0}, joint: {x: x1, y: y1}, endEffector: {x: x2, y: y2} };
}

// Calculate distance
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// ==========================================
// Particle Background Animation
// ==========================================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (3 + Math.random() * 4) + 's';
        container.appendChild(particle);
    }
}

// ==========================================
// Canvas Drawing with Animation
// ==========================================
function drawRobotArm(canvas, theta1Deg, theta2Deg, options = {}) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate scale and center
    const scale = Math.min(width, height) / (ROBOT.maxReach * 2.5);
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw animated grid
    const time = Date.now() * 0.001;
    ctx.strokeStyle = `rgba(0, 245, 255, ${0.05 + 0.03 * Math.sin(time)})`;
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i += 0.5) {
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, 0);
        ctx.lineTo(centerX + i * scale, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, centerY - i * scale);
        ctx.lineTo(width, centerY - i * scale);
        ctx.stroke();
    }
    
    // Draw reachability circles with glow
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, ROBOT.maxReach * scale, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, ROBOT.minReach * scale, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Get joint positions
    const joints = getJointPositions(theta1Deg, theta2Deg);
    
    // Convert to canvas coordinates (flip Y)
    const baseX = centerX + joints.base.x * scale;
    const baseY = centerY - joints.base.y * scale;
    const jointX = centerX + joints.joint.x * scale;
    const jointY = centerY - joints.joint.y * scale;
    const eeX = centerX + joints.endEffector.x * scale;
    const eeY = centerY - joints.endEffector.y * scale;
    
    // Draw Link 1 with gradient
    const gradient1 = ctx.createLinearGradient(baseX, baseY, jointX, jointY);
    gradient1.addColorStop(0, '#ff4466');
    gradient1.addColorStop(1, '#ff6688');
    ctx.strokeStyle = gradient1;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(jointX, jointY);
    ctx.stroke();
    
    // Link 1 glow
    ctx.strokeStyle = 'rgba(255, 68, 102, 0.4)';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(jointX, jointY);
    ctx.stroke();
    
    // Draw Link 2 with gradient
    const gradient2 = ctx.createLinearGradient(jointX, jointY, eeX, eeY);
    gradient2.addColorStop(0, '#00aaff');
    gradient2.addColorStop(1, '#00ccff');
    ctx.strokeStyle = gradient2;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(jointX, jointY);
    ctx.lineTo(eeX, eeY);
    ctx.stroke();
    
    // Link 2 glow
    ctx.strokeStyle = 'rgba(0, 170, 255, 0.4)';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(jointX, jointY);
    ctx.lineTo(eeX, eeY);
    ctx.stroke();
    
    // Draw joints with pulsing effect
    const pulse = 0.8 + 0.2 * Math.sin(time * 3);
    
    const drawJoint = (x, y, color, label, size = 10) => {
        // Outer glow
        ctx.fillStyle = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(x, y, size * 1.8 * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Main joint
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        if (label && options.showLabels !== false) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Orbitron';
            ctx.fillText(label, x + 15, y - 15);
        }
    };
    
    drawJoint(baseX, baseY, 'rgb(255, 255, 255)', 'Base', 12);
    drawJoint(jointX, jointY, 'rgb(255, 200, 0)', 'Joint', 10);
    
    // Draw end effector (hide if needed)
    if (!options.hideEndEffector) {
        drawJoint(eeX, eeY, 'rgb(0, 255, 136)', 'End', 10);
        
        // End effector coordinates
        if (options.showCoords) {
            ctx.font = '12px Space Mono';
            ctx.fillStyle = '#00ff88';
            const coordText = `(${joints.endEffector.x.toFixed(2)}, ${joints.endEffector.y.toFixed(2)})`;
            ctx.fillText(coordText, eeX + 15, eeY + 5);
        }
    }
    
    // Draw angle annotations
    if (options.showAngles) {
        ctx.font = '12px Space Mono';
        ctx.fillStyle = '#ffff00';
        
        const angle1Text = `θ₁=${theta1Deg}°`;
        ctx.fillText(angle1Text, baseX + 25, baseY + 30);
        
        const angle2Text = `θ₂=${theta2Deg}°`;
        ctx.fillText(angle2Text, jointX + 25, jointY + 30);
    }
    
    return { eeX: joints.endEffector.x, eeY: joints.endEffector.y };
}

// Animate robot arm drawing
function animateRobotArm(canvas, theta1Deg, theta2Deg, options = {}) {
    let progress = 0;
    const duration = 30; // frames
    
    function animate() {
        progress++;
        const eased = easeOutCubic(Math.min(progress / duration, 1));
        const currentTheta1 = theta1Deg * eased;
        const currentTheta2 = theta2Deg * eased;
        
        drawRobotArm(canvas, currentTheta1, currentTheta2, options);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

// ==========================================
// Story Typing Effect
// ==========================================
const storyLines = [
    "⚠️ SECURITY BREACH DETECTED",
    "",
    "You are trapped in the Advanced Robotics Lab.",
    "The AI security system has locked all exits.",
    "",
    "To escape, you must prove your understanding",
    "of Forward Kinematics for the SCARA robot arm.",
    "",
    "Solve 3 challenges to unlock the door...",
    "",
    "🔐 GOOD LUCK, ENGINEER."
];

async function typeStory() {
    const storyElement = document.getElementById('storyText');
    const startBtn = document.getElementById('startBtn');
    
    for (const line of storyLines) {
        if (line === "") {
            storyElement.innerHTML += "<br>";
            await sleep(100);
            continue;
        }
        
        for (const char of line) {
            storyElement.innerHTML = storyElement.innerHTML.slice(0, -1) + char + '█';
            await sleep(10);
        }
        storyElement.innerHTML = storyElement.innerHTML.slice(0, -1) + "<br>█";
        await sleep(70);
    }
    
    storyElement.innerHTML = storyElement.innerHTML.slice(0, -1);
    storyElement.classList.remove('typing-text');
    
    // Show start button with animation
    startBtn.style.display = 'block';
    startBtn.style.animation = 'fadeInUp 0.5s ease';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// Room Navigation
// ==========================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    screen.classList.add('active');
    screen.style.animation = 'fadeInUp 0.5s ease';
    updateProgress();
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const progress = (gameState.currentRoom / 3) * 100;
    progressFill.style.width = progress + '%';
    
    const messages = ['SYSTEM LOCKED', 'LEVEL 1 COMPLETE', 'LEVEL 2 COMPLETE', 'ESCAPED!'];
    progressText.textContent = messages[gameState.currentRoom];
}

function nextRoom() {
    gameState.currentRoom++;
    
    switch (gameState.currentRoom) {
        case 1:
            showScreen('room1');
            initRoom(1);
            break;
        case 2:
            showScreen('room2');
            initRoom(2);
            break;
        case 3:
            showScreen('room3');
            initRoom(3);
            break;
        case 4:
            showScreen('victoryScreen');
            celebrateVictory();
            break;
    }
}

// ==========================================
// Initialize Room with Fixed Question
// ==========================================
function initRoom(roomNum) {
    const questionIndex = roomNum - 1;
    const question = gameState.questions[questionIndex];
    
    // Calculate correct answer
    const result = forwardKinematics(question.theta1, question.theta2);
    question.correctX = result.x;
    question.correctY = result.y;
    
    // Update display based on room number
    const canvas = document.getElementById(`room${roomNum}Canvas`);
    
    if (roomNum === 1) {
        document.getElementById('givenTheta1').textContent = question.theta1 + '°';
        document.getElementById('givenTheta2').textContent = question.theta2 + '°';
    } else if (roomNum === 2) {
        document.getElementById('givenTheta1_2').textContent = question.theta1 + '°';
        document.getElementById('givenTheta2_2').textContent = question.theta2 + '°';
    } else if (roomNum === 3) {
        document.getElementById('givenTheta1_3').textContent = question.theta1 + '°';
        document.getElementById('givenTheta2_3').textContent = question.theta2 + '°';
    }
    
    // Animate robot arm
    animateRobotArm(canvas, question.theta1, question.theta2, {
        hideEndEffector: true,
        showAngles: true
    });
    
    // Clear inputs
    document.getElementById(`room${roomNum}AnswerX`).value = '';
    document.getElementById(`room${roomNum}AnswerY`).value = '';
    document.getElementById(`room${roomNum}Feedback`).className = 'feedback';
}

// ==========================================
// Check Answer with Animation
// ==========================================
function checkAnswer(roomNum) {
    const questionIndex = roomNum - 1;
    const question = gameState.questions[questionIndex];
    
    const userX = parseFloat(document.getElementById(`room${roomNum}AnswerX`).value);
    const userY = parseFloat(document.getElementById(`room${roomNum}AnswerY`).value);
    const feedback = document.getElementById(`room${roomNum}Feedback`);
    
    // Convert expected answers to centimeters for comparison
    const expectedX = question.correctX * 100;
    const expectedY = question.correctY * 100;
    
    gameState.totalAttempts++;
    
    if (isNaN(userX) || isNaN(userY)) {
        feedback.textContent = '❌ Please enter valid numbers!';
        feedback.className = 'feedback error shake';
        return;
    }
    
    // Calculate error in centimeters (tolerance of 15cm)
    const error = distance(userX, userY, expectedX, expectedY);
    
    if (error <= 15) {
        // Success!
        feedback.innerHTML = `✅ CORRECT! Access Code Verified!<br>
            Actual position: (${(question.correctX * 100).toFixed(2)} cm, ${(question.correctY * 100).toFixed(2)} cm)`;
        feedback.className = 'feedback success';
        
        // Show the end effector with animation
        const canvas = document.getElementById(`room${roomNum}Canvas`);
        drawRobotArm(canvas, question.theta1, question.theta2, {
            showAngles: true,
            showCoords: true
        });
        
        // Hide question mark
        const overlay = document.querySelector(`#room${roomNum} .canvas-overlay, #room${roomNum} .canvas-overlay-2, #room${roomNum} .canvas-overlay-3`);
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.5s ease';
        }
        
        // Create success particles
        createSuccessParticles(roomNum);
        
        // Proceed to next room after delay
        setTimeout(() => nextRoom(), 2500);
    } else {
        feedback.innerHTML = `❌ Incorrect! Error: ${error.toFixed(2)} cm<br>
            Hint: Double-check your calculations!`;
        feedback.className = 'feedback error shake';
        
        // Shake animation
        const card = document.querySelector(`#room${roomNum} .challenge-card`);
        card.style.animation = 'shake 0.5s ease';
        setTimeout(() => card.style.animation = '', 500);
    }
}

function createSuccessParticles(roomNum) {
    const card = document.querySelector(`#room${roomNum} .challenge-card`);
    const colors = ['#00ff88', '#00f5ff', '#ffff00'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'success-particle';
        particle.style.left = 50 + (Math.random() - 0.5) * 40 + '%';
        particle.style.top = 50 + (Math.random() - 0.5) * 40 + '%';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = Math.random() * 0.3 + 's';
        card.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
    }
}

// ==========================================
// Victory Celebration
// ==========================================
function celebrateVictory() {
    // Calculate stats
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - gameState.startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    
    document.getElementById('finalTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('finalAttempts').textContent = gameState.totalAttempts;
    
    // Confetti!
    createConfetti();
}

function createConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#00f5ff', '#ff00ff', '#00ff88', '#ffff00', '#ff6600'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (2 + Math.random() * 3) + 's';
        container.appendChild(confetti);
    }
}

function restartGame() {
    // Reset state
    gameState.currentRoom = 0;
    gameState.totalAttempts = 0;
    gameState.startTime = Date.now();
    
    // Clear confetti
    document.getElementById('confetti').innerHTML = '';
    
    // Reset all overlays
    document.querySelectorAll('.canvas-overlay, .canvas-overlay-2, .canvas-overlay-3').forEach(overlay => {
        overlay.style.opacity = '1';
    });
    
    // Go to room 1
    nextRoom();
}

// ==========================================
// Event Listeners
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Create background particles
    createParticles();
    
    // Start typing effect
    typeStory();
    
    // Start button
    document.getElementById('startBtn').onclick = () => {
        gameState.startTime = Date.now();
        nextRoom();
    };
    
    // Room 1 submit
    document.getElementById('room1Submit').onclick = () => checkAnswer(1);
    
    // Room 1 enter key
    document.querySelectorAll('#room1 input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAnswer(1);
        });
    });
    
    // Room 2 submit
    document.getElementById('room2Submit').onclick = () => checkAnswer(2);
    
    // Room 2 enter key
    document.querySelectorAll('#room2 input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAnswer(2);
        });
    });
    
    // Room 3 submit
    document.getElementById('room3Submit').onclick = () => checkAnswer(3);
    
    // Room 3 enter key
    document.querySelectorAll('#room3 input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAnswer(3);
        });
    });
    
    // Restart button
    document.getElementById('restartBtn').onclick = restartGame;
});
