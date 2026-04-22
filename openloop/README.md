# ⚡ OPEN LOOP 2026

**Open Loop 2026** is a premium, immersive hackathon landing page built for the Yenepoya School of Engineering & Technology. It features high-fidelity 3D graphics, intricate GSAP animations, and a real-time synchronized timer system.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **3D Graphics:** Three.js, React Three Fiber (R3F), Drei, Post-processing
- **Animations:** GSAP 3 (ScrollTrigger), Lenis (Smooth Scroll)
- **Routing:** React Router v7
- **Icons:** Lucide React

### Backend & Deployment
- **Platform:** Vercel (SPA with dynamic rewrites)
- **API:** Node.js Serverless Functions (`/api/timer`)
- **Database:** Upstash Redis (For real-time timer persistence)
- **Dev Environment:** Vite 8 with intelligent error-masking proxy

---

## ✨ Key Features

### 🤖 High-Fidelity 3D Hero
- **Interactive Robot:** Custom glTF model ("Damaged Helmet") with dynamic camera rigging.
- **Scroll-Linked Animations:** Robot rotation, scale, and position are seamlessly mapped to scroll progress using GSAP.
- **Mouse Parallax:** Subtle 3D movement reacting to desktop cursor position.

### 🕒 Advanced Timer System
- **Dual Modes:** Pre-event countdown (Fixed: April 25, 2026) and 24-hour Challenge mode.
- **Cross-Tab Sync:** Uses `BroadcastChannel` and REST API to ensure the timer is identical across every tab and device.
- **State Persistence:** Upstash Redis backend ensures the challenge timer remains accurate even after page refreshes.

### 📜 3D Timeline & Interactive Sections
- **11-Event Schedule:** A 3D-rendered timeline mapping the journey from setup to the closing ceremony.
- **Innovation Tracks:** Four distinct themes (Learning, Healthcare, FinTech, Open Innovation) with staggered card reveals.
- **Magnetic UI:** Interactive elements with physics-based hover effects.

### 📱 Perfect Mobile Experience
- **Dedicated Components:** Not just responsive CSS—completely separate `MobileLayout` and `MobileNav` for touch-optimized performance.
- **Dynamic Viewport Height:** Uses `svh` units to prevent layout jumps caused by mobile browser toolbars.

---

## 🏗️ Project Architecture

```text
src/
├── components/
│   ├── HeroScene.tsx         # 3D Robot & lighting environment
│   ├── LoaderScene.tsx       # 3000-particle swarm effect
│   ├── Timeline3D.tsx        # Scroll-synced schedule events
│   ├── desktop/              # Desktop-specific layouts
│   └── mobile/               # Mobile-specific sections & nav
├── pages/
│   ├── ChallengePage.tsx     # 24H hackathon timer dashboard
│   ├── TopSelected25.tsx     # Team rankings & event statistics
│   └── CrewMembers.tsx       # Team showcase (17+ members)
├── hooks/
│   ├── useScrollProgress.ts  # Normalizes [0,1] scroll state
│   └── useIsMobile.ts        # Intelligent viewport detection
└── utils/
    └── timerClient.ts        # Global timer state & skew correction
api/
└── timer.js                  # Vercel Serverless Redis handler
```

---

## 🎨 Design Philosophy
- **Primary Theme:** Neon Green (`#C6FF00`) on Deep Void Black (`#020600`).
- **Typography:** *Share Tech Mono* for a technical, high-precision aesthetic.
- **Performance:** Lazy-loaded 3D assets and split vendor chunks (Three.js/GSAP) for fast initial paint.

---

## 🚀 Live Environment
- **URL Configuration:** Handled via `vercel.json` with SPA routing.
- **API Endpoints:** Real-time state management at `/api/timer`.
- **Shortlisted Teams:** Stats tracking for 300+ participants, 100+ colleges, and 14+ states.

