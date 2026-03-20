# Introduce Me Page

자기소개 포트폴리오 웹사이트입니다.

## 기술 스택

- **React 18** + **Vite**
- **React Router v6** — `/` (About), `/portfolio` (Portfolio)
- **Tailwind CSS v3**
- **Framer Motion** — 스크롤 애니메이션, 페이지 전환

## 시작하기

```bash
npm install
npm run dev
```

개발 서버: http://localhost:5173

## 빌드

```bash
npm run build
npm run preview
```

## 구조

```
src/
├── components/
│   ├── layout/Navbar.jsx
│   ├── common/TagBadge.jsx
│   ├── about/
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── SkillsSection.jsx
│   │   └── ContactSection.jsx
│   └── portfolio/
│       ├── FilterTabs.jsx
│       ├── ProjectCard.jsx
│       └── ProjectModal.jsx
├── pages/
│   ├── AboutPage.jsx
│   └── PortfolioPage.jsx
└── data/
    ├── skills.js
    └── projects.js
```
