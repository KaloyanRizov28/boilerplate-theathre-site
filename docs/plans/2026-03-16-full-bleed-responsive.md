# Full-Bleed Responsive Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all `max-w-[1440px]` constraints so the site fills any screen width, and make show cards scale proportionally using CSS Grid instead of fixed pixel dimensions.

**Architecture:** Each section's inner container loses its `max-w-[1440px]` cap while keeping `px-8` horizontal padding. The hero image section becomes truly full-bleed. Show cards switch from fixed `267×481px` inline styles to a CSS Grid with `aspect-[267/370]` on the image to preserve poster proportions at any size.

**Tech Stack:** Next.js 14, Tailwind CSS v4, React

---

### Task 1: Fix hero-section.jsx — full-bleed image + meta row

**Files:**
- Modify: `src/components/homePage/hero-section.jsx`

**Step 1: Remove max-width from the image section**

Find line 118:
```jsx
<section className="relative w-full max-w-[1440px] h-[687px] mx-auto overflow-hidden bg-black">
```
Change to:
```jsx
<section className="relative w-full h-[687px] overflow-hidden bg-black">
```

**Step 2: Remove maxWidth inline style from the meta row**

Find line 185:
```jsx
<div className="mx-auto px-8" style={{ maxWidth: '1440px' }}>
```
Change to:
```jsx
<div className="px-8">
```

**Step 3: Commit**
```bash
git add src/components/homePage/hero-section.jsx
git commit -m "fix: make hero section full-bleed on all screen widths"
```

---

### Task 2: Fix header.jsx — full-width content

**Files:**
- Modify: `src/components/layout/header.jsx`

**Step 1: Remove maxWidth inline style from inner content div**

Find line 44:
```jsx
<div className="mx-auto px-8" style={{ maxWidth: '1440px', height: '118px' }}>
```
Change to:
```jsx
<div className="px-8" style={{ height: '118px' }}>
```

**Step 2: Commit**
```bash
git add src/components/layout/header.jsx
git commit -m "fix: remove max-width cap from header content"
```

---

### Task 3: Fix show-selection.jsx — responsive CSS grid cards

**Files:**
- Modify: `src/components/homePage/show-selection.jsx`

**Step 1: Remove max-width from inner container**

Find line 22:
```jsx
<div className="mx-auto max-w-[1440px]">
```
Change to:
```jsx
<div>
```

**Step 2: Switch grid from flex to CSS Grid**

Find line 55:
```jsx
<div className="flex flex-wrap gap-8 justify-center">
```
Change to:
```jsx
<div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
```

**Step 3: Remove fixed inline dimensions from card Link**

Find:
```jsx
className="group block bg-theater-dark overflow-hidden transition-all duration-300 flex-shrink-0"
style={{ width: '267px', height: '481px' }}
```
Change to:
```jsx
className="group block bg-theater-dark overflow-hidden transition-all duration-300 w-full"
```
(Remove the `style` prop entirely.)

**Step 4: Replace fixed image height with aspect ratio**

Find:
```jsx
<div className="relative w-full flex-shrink-0" style={{ height: '370px' }}>
```
Change to:
```jsx
<div className="relative w-full aspect-[267/370]">
```

**Step 5: Update Image sizes prop for responsive columns**

Find:
```jsx
sizes="267px"
```
Change to:
```jsx
sizes="(max-width: 1024px) 50vw, 33vw"
```

**Step 6: Commit**
```bash
git add src/components/homePage/show-selection.jsx
git commit -m "fix: responsive CSS grid for show cards, preserve aspect ratio"
```

---

### Task 4: Fix about-theathre.jsx — remove max-width cap

**Files:**
- Modify: `src/components/homePage/about-theathre.jsx`

**Step 1: Remove max-width from inner container**

Find line 8:
```jsx
<div className="mx-auto max-w-[1440px]">
```
Change to:
```jsx
<div>
```

**Step 2: Commit**
```bash
git add src/components/homePage/about-theathre.jsx
git commit -m "fix: remove max-width cap from about section"
```

---

### Task 5: Fix cast-section.jsx — remove max-width cap

**Files:**
- Modify: `src/components/homePage/cast-section.jsx`

**Step 1: Remove max-width from inner container**

Find line 68:
```jsx
<div className="relative overflow-hidden max-w-[1440px] mx-auto">
```
Change to:
```jsx
<div className="relative overflow-hidden">
```

**Step 2: Commit**
```bash
git add src/components/homePage/cast-section.jsx
git commit -m "fix: remove max-width cap from cast section"
```
