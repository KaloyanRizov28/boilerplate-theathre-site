# Landing Page Spacing Uniformity Design

**Date:** 2026-03-16
**Status:** Approved

## Problem

Padding and margins are inconsistent across the homepage sections:
- Horizontal padding varies: `px-8` (hero meta, header) vs `px-6` (shows, about, cast)
- `max-w-[1440px]` container missing on About and Cast sections
- Vertical padding varies: `py-6` (shows, cast) vs `py-8` (about)
- Shows grid uses a hard-coded `gap-[143px]` that produces uneven spacing

## Solution — Option A (px-8 / py-8)

**Spacing system:**
- Horizontal padding: `px-8` (32px) on all section wrappers — matches header
- Max-width: `max-w-[1440px] mx-auto` on all inner containers
- Vertical padding: `py-8` (32px) on all sections
- Shows grid gap: `gap-8` (32px)

## Files Changed

| File | Change |
|---|---|
| `show-selection.jsx` | `px-6 py-6` → `px-8 py-8`; `gap-[143px]` → `gap-8` |
| `about-theathre.jsx` | `py-8 px-6` → `py-8 px-8`; add `max-w-[1440px]` to inner div |
| `cast-section.jsx` | `py-6 px-6` → `py-8 px-8`; add `max-w-[1440px] mx-auto` to inner container |
| `hero-section.jsx` | No change (already uses correct values) |
