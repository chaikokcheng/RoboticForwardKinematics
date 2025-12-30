# RobotRider - Forward Kinematics Educational Website

## Project Overview
This website serves as an educational platform for teaching Forward Kinematics to three different audience levels:
- Junior School (Ages 13-15)
- High School / Pre-University
- Undergraduate / Professional

## Team Members
- KHOO BOO JING (215382)
- LIM CHUAN ZHE (215493)
- CHOO JIAN FENG (215089)
- CHAI KOK CHENG (217463)
- TANG ZI KIAN (217064)

## Website Structure

```
RBTgrpwebsite/
│
├── index.html          → Home page with overview and navigation
├── video1.html         → Junior School level video page
├── video2.html         → High School level video page
├── video3.html         → Undergraduate level video page
├── interactive.html    → Interactive forward kinematics simulator
├── reflection.html     → Project reflection and acknowledgments
├── style.css           → Stylesheet for all pages
├── script.js           → JavaScript for interactive simulator
└── assets/
     └── images/        → Optional images folder
```

## Features

### 1. Home Page (index.html)
- Project overview and objectives
- Team member information
- Preview cards for all three videos
- Link to interactive demo

### 2. Video Pages (video1.html, video2.html, video3.html)
- Embedded video player
- Learning objectives
- Key concepts explained
- Mathematical foundations (where applicable)
- Navigation between videos

### 3. Interactive Demo (interactive.html)
- Real-time 2D robot arm simulator
- Adjustable joint angles and link lengths
- Visual feedback of end-effector position
- Mathematical formulas displayed
- Challenge tasks for users

### 4. Reflection Page (reflection.html)
- Outreach intent
- Communication adaptation strategies
- Key learnings
- Acknowledgments and references



## Interactive Simulator Features

The interactive demo includes:
- **2-link planar robot arm** visualization
- **Real-time forward kinematics calculation**
- **Adjustable parameters:**
  - Joint 1 angle (θ₁): -180° to 180°
  - Joint 2 angle (θ₂): -180° to 180°
  - Link 1 length: 50-250 pixels
  - Link 2 length: 50-200 pixels
- **Live position display** (X, Y coordinates)
- **Animation mode** for smooth movement demonstration
- **Reset button** to return to default position

## Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Works on desktop and mobile devices

## Technical Details

### Forward Kinematics Formula
For a 2-link planar arm:
- **x = L₁cos(θ₁) + L₂cos(θ₁ + θ₂)**
- **y = L₁sin(θ₁) + L₂sin(θ₁ + θ₂)**

Where:
- L₁, L₂ = Link lengths
- θ₁, θ₂ = Joint angles

## Notes
- The website uses YouTube embeds for videos (requires internet connection for video playback)
- All other features work offline
- The interactive simulator uses HTML5 Canvas for rendering and works completely offline
- YouTube videos can be unlisted (private) - they will still embed properly

## Contact
For questions or issues, please contact the RobotRider team members listed above.

