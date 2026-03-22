# Landing Page Spacing Uniformity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unify all horizontal padding, vertical padding, and max-width containers across the homepage sections to match the header's spacing system.

**Architecture:** Each homepage section (`show-selection`, `about-theathre`, `cast-section`) gets identical `px-8 py-8` and `max-w-[1440px] mx-auto` so content always aligns with the header's visual rail. The hero section already conforms and needs no changes.

**Tech Stack:** Next.js, Tailwind CSS v4

---

### Task 1: Fix show-selection.jsx

**Files:**
- Modify: `src/components/homePage/show-selection.jsx:21` (section padding)
- Modify: `src/components/homePage/show-selection.jsx:55` (grid gap)

**Step 1: Change section padding**

In `show-selection.jsx` line 21, change:
```jsx
<section className="bg-theater-dark px-6 py-6">
```
to:
```jsx
<section className="bg-theater-dark px-8 py-8">
```

**Step 2: Fix shows grid gap**

On line 55, change:
```jsx
<div className="flex flex-wrap gap-[143px] justify-center">
```
to:
```jsx
<div className="flex flex-wrap gap-8 justify-center">
```

**Step 3: Commit**
```bash
git add src/components/homePage/show-selection.jsx
git commit -m "fix: uniform padding and gap in shows section"
```

---

### Task 2: Fix about-theathre.jsx

**Files:**
- Modify: `src/components/homePage/about-theathre.jsx:7` (section padding)
- Modify: `src/components/homePage/about-theathre.jsx:8` (inner container max-width)

**Step 1: Change section padding**

On line 7, change:
```jsx
<section className="bg-theater-dark py-8 px-6 ">
```
to:
```jsx
<section className="bg-theater-dark py-8 px-8">
```

**Step 2: Add max-width to inner container**

On line 8, change:
```jsx
<div className="mx-auto">
```
to:
```jsx
<div className="mx-auto max-w-[1440px]">
```

**Step 3: Commit**
```bash
git add src/components/homePage/about-theathre.jsx
git commit -m "fix: uniform padding and max-width in about section"
```

---

### Task 3: Fix cast-section.jsx

**Files:**
- Modify: `src/components/homePage/cast-section.jsx:66` (section padding)
- Modify: `src/components/homePage/cast-section.jsx:68` (inner container max-width)

**Step 1: Change section padding**

On line 66, change:
```jsx
<section className="bg-theater-dark py-6 px-6 ">
```
to:
```jsx
<section className="bg-theater-dark py-8 px-8">
```

**Step 2: Add max-width to inner container**

On line 68, change:
```jsx
<div className="relative overflow-hidden">
```
to:
```jsx
<div className="relative overflow-hidden max-w-[1440px] mx-auto">
```

**Step 3: Commit**
```bash
git add src/components/homePage/cast-section.jsx
git commit -m "fix: uniform padding and max-width in cast section"
```
