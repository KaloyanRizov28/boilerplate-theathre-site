# Full-Bleed Responsive Layout Design

**Date:** 2026-03-16
**Status:** Approved

## Problem

The site has a `max-w-[1440px]` cap on all sections. On screens wider than 1440px, the hero image and all content show dark margins on both sides. Show cards are fixed at 267px which is tiny on wide screens.

## Solution — Option A (Full bleed, cards scale to fill)

Remove all `max-w-[1440px]` constraints from sections. Show cards switch to CSS Grid that fills available width proportionally while preserving the poster aspect ratio.

## Changes Per File

### hero-section.jsx
- Remove `max-w-[1440px]` from `<section>` → hero image fills full screen width
- Keep `h-[687px]` height unchanged
- Remove `maxWidth: '1440px'` inline style from meta row div

### header.jsx
- Remove `maxWidth: '1440px'` from inner content div (keep `px-8`, remove the `style` prop)

### show-selection.jsx
- Remove `max-w-[1440px]` from inner container div
- Replace `flex flex-wrap gap-8 justify-center` → `grid grid-cols-2 lg:grid-cols-3 gap-8`
- Remove `style={{ width: '267px', height: '481px' }}` from card Link → add `w-full` class
- Replace `style={{ height: '370px' }}` on image div → use `aspect-[267/370]` class
- Content section below image: remove height constraints, keep existing classes

### about-theathre.jsx
- Remove `max-w-[1440px]` from inner container div

### cast-section.jsx
- Remove `max-w-[1440px] mx-auto` from inner container div
