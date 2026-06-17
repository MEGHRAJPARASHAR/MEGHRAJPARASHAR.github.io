# Portfolio Website

A modern, responsive personal portfolio website built with **React** and **Vite**. This project showcases my skills and projects with smooth animations powered by **GSAP** and interactive features like a typing effect and scroll-triggered animations.


---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

This portfolio website is designed to introduce who I am, my skills, and the services I offer as a developer. It includes the following sections:

- **Home:** A landing page featuring an animated introduction with a dynamic typing effect.
- **About:** Personal details, skills, and education information presented with engaging scroll-triggered animations.
- **Projects (optional):** A section (currently commented out) intended for showcasing work.
- **Contact:** A contact form integrated with [Formspree](https://formspree.io) to easily get in touch.

Animations are implemented using **GSAP** (GreenSock Animation Platform) along with the **ScrollTrigger** plugin to add a modern, interactive feel to the user experience.

---

## Features

- **Responsive Navigation:**  
  A mobile-friendly hamburger menu with smooth transitions using react-scroll and GSAP animations.

- **Animated Introduction:**  
  Home section with a typing effect (via [react-typing-effect](https://www.npmjs.com/package/react-typing-effect)) and animated text lines.

- **About Section with Scroll Animations:**  
  Personal info, skills, and education details reveal themselves with subtle animations as you scroll down.

- **Project Cards:**  
  Reusable card components to display skills (MERN Stack, Java, DSA) with hover effects.

- **Interactive Contact Form:**  
  A contact form that submits data via Formspree, ensuring hassle-free communication.

---

## Tech Stack

- **Frontend Framework:** React (via Vite)
- **Build Tool:** Vite
- **Animation Library:** GSAP with ScrollTrigger
- **CSS:** Custom CSS modules for component-level styling
- **Additional Libraries:**  
  - [react-scroll](https://www.npmjs.com/package/react-scroll) for smooth scrolling  
  - [react-typing-effect](https://www.npmjs.com/package/react-typing-effect) for animated text

---

## Project Structure

```text
portfolio/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── eslint.config.js
├── index.html
├── vite.config.js
└── src/
    ├── App.jsx
    ├── assets/
    │   ├── man.png         // Home section image
    │   ├── mern.png        // Skill card image for MERN Stack
    │   ├── java.png        // Skill card image for Java
    │   ├── dsa.png         // Skill card image for DSA
    │   └── contact.png     // Contact section image
    └── COMPONENTS/
        ├── NAV/
        │   ├── Navbar.jsx
        │   └── Navbar.css
        ├── HOME/
        │   ├── home.jsx
        │   └── home.css
        ├── ABOUT/
        │   ├── about.jsx
        │   └── about.css
        ├── CARD/
        │   ├── card.jsx
        │   └── card.css
        └── CONTACT/
            ├── contact.jsx
            └── contact.css
```

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Meghraj-Parashar/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## Usage

- **Development:** Use `npm run dev` to start the local development server.
- **Build:** Run `npm run build` to create a production-ready build in the `dist/` directory.
- **Preview:** Use `npm run preview` to locally preview the production build.
- **Deploy:** Run `npm run deploy` to publish the site to GitHub Pages.

---

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](https://github.com/Meghraj-Parashar/portfolio/issues) if you have any suggestions or want to contribute.

---

## License

This project is licensed under the MIT License.

---

## Contact

**Meghraj Parashar**  
- GitHub: [@Meghraj-Parashar](https://github.com/Meghraj-Parashar)
- Portfolio: [https://meghraj-parashar.github.io/portfolio](https://meghraj-parashar.github.io/portfolio)
