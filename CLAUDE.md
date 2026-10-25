# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal one-page CV/portfolio for Khalid El Madkoury, in plain HTML/CSS/JS: dark theme, animated and interactive. No build step, no dependencies, no tests. Open `index.html` in a browser to run it. The only external resource is Google Fonts (Inter, JetBrains Mono). The project is not a git repository.

## Architecture

- **Content lives only in `index.html`.** Sections are `#home`, `#about`, `#experience`, `#education`, `#skills` and `#contact`. Nav links map to sections through `data-section`, and an IntersectionObserver in `script.js` highlights the link for the section in view. A new section needs both a `<section id>` and a matching nav link.
- **Animations are attribute-driven.** Behavior is opted into through classes and data attributes that `script.js` picks up on load, so new content usually needs no JS:
  - `.reveal`: fade-up on scroll. The stagger delay comes from the element's position among its `.reveal` siblings.
  - `data-count` / `data-suffix` (inside a `.reveal`): count-up number when revealed.
  - `.tilt`: 3D hover tilt. `.magnetic`: button follows the cursor. Both run only on fine-pointer devices and are disabled under reduced motion.
  - `.bar i[data-level]`: skill bar fill percentage, re-animated whenever its tab is selected.
  - `.semester-bar span` uses the CSS variable `--w` and animates when its `.edu` card gets `.visible`.
- **Experience timeline**: each `.t-item` has a `.t-head` button and a `.t-body`. On load, JS wraps the `.t-body` children in `.t-body-inner`, which the CSS needs for the `grid-template-rows` 0fr→1fr expand animation. The first item opens by default.
- **Skills tabs**: `.tab[data-tab]` toggles the `.panel` whose id matches. `.tab-indicator` is positioned from the active tab's offsets, so it must stay inside `.tabs`.
- **Theme**: all colors are CSS variables on `:root` in `style.css` (`--accent` purple, `--accent-2` cyan).
- **Print/PDF**: the "Download as PDF" button calls `window.print()`. The `@media print` block hides effects and navigation, switches to a light background, expands every timeline item and shows every skills panel. Check it after changing layout.
- **Accessibility**: `prefers-reduced-motion` turns off the CSS animations, the typing effect and the particle canvas.
