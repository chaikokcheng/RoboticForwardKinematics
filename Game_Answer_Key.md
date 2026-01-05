# 🔐 Robot Lab Escape - Answer Key

## Forward Kinematics Game - Fixed Questions & Answers

### Robot Arm Specifications

- **Link 1 (a₁):** 100 cm (1.0 m)
- **Link 2 (a₂):** 80 cm (0.8 m)

### Forward Kinematics Formulas

```text
x = a₁·cos(θ₁) + a₂·cos(θ₁ + θ₂)
y = a₁·sin(θ₁) + a₂·sin(θ₁ + θ₂)
```

---

## 📝 Question 1: Basic Angles

**Given:**

- θ₁ = 45°
- θ₂ = 30°

**Calculation:**

```text
θ₁ = 45° = 0.7854 rad
θ₁ + θ₂ = 45° + 30° = 75° = 1.3090 rad

x = 100 × cos(45°) + 80 × cos(75°)
x = 100 × 0.7071 + 80 × 0.2588
x = 70.71 + 20.71
x ≈ 91.42 cm

y = 100 × sin(45°) + 80 × sin(75°)
y = 100 × 0.7071 + 80 × 0.9659
y = 70.71 + 77.27
y ≈ 147.98 cm
```

**✅ Answer: x ≈ 91.42 cm, y ≈ 147.98 cm**

---

## 📝 Question 2: Negative Angles

**Given:**

- θ₁ = -30°
- θ₂ = 60°

**Calculation:**

```text
θ₁ = -30° = -0.5236 rad
θ₁ + θ₂ = -30° + 60° = 30° = 0.5236 rad

x = 100 × cos(-30°) + 80 × cos(30°)
x = 100 × 0.8660 + 80 × 0.8660
x = 86.60 + 69.28
x ≈ 155.88 cm

y = 100 × sin(-30°) + 80 × sin(30°)
y = 100 × (-0.5000) + 80 × 0.5000
y = -50.00 + 40.00
y ≈ -10.00 cm
```

**✅ Answer: x ≈ 155.88 cm, y ≈ -10.00 cm**

---

## 📝 Question 3: Vertical Configuration

**Given:**

- θ₁ = 90°
- θ₂ = -45°

**Calculation:**

```text
θ₁ = 90° = 1.5708 rad
θ₁ + θ₂ = 90° + (-45°) = 45° = 0.7854 rad

x = 100 × cos(90°) + 80 × cos(45°)
x = 100 × 0.0000 + 80 × 0.7071
x = 0.00 + 56.57
x ≈ 56.57 cm

y = 100 × sin(90°) + 80 × sin(45°)
y = 100 × 1.0000 + 80 × 0.7071
y = 100.00 + 56.57
y ≈ 156.57 cm
```

**✅ Answer: x ≈ 56.57 cm, y ≈ 156.57 cm**

---

## 📊 Summary Table

| Question | θ₁ | θ₂ | X (cm) | Y (cm) |
|----------|-----|-----|--------|--------|
| 1 | 45° | 30° | **91.42** | **147.98** |
| 2 | -30° | 60° | **155.88** | **-10.00** |
| 3 | 90° | -45° | **56.57** | **156.57** |

---

## 💡 Tips for Students

1. **Convert degrees to radians** if using a calculator in radian mode
2. **Pay attention to signs** - negative angles rotate clockwise
3. **θ₂ is relative to Link 1** - the second angle is measured from the first link's direction
4. **Tolerance:** Answers within ±15 cm of the correct value are accepted
5. **Link lengths in cm:** a₁ = 100 cm, a₂ = 80 cm

---

*Game created for SCARA Robot Forward Kinematics Education*
