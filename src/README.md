# ⚡ THIRD EYE: Core Application

Welcome to the **Developer Hub** for Third Eye. This directory contains the React/TypeScript source code that powers the forensic auditing engine.

[![Tech Stack](https://img.shields.io/badge/Tech-React%2018%20%7C%20Vite%20%7C%20TypeScript-blue.svg)]()
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](../../LICENSE)

---

## 🚀 Quick Start Guide

Follow these steps to spin up the forensic engine locally.

### 1. Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)
- **Google Gemini API Key**

### 2. Installation

```bash
# Navigate to the source directory
cd src

# Install dependencies
npm install
```

### 3. Environment Setup

Security is paramount. We use a secure `.env` configuration.

1.  Copy the example file:
    ```bash
    cp .env.example .env.local
    ```
2.  Open `.env.local` and add your capabilities:
    ```env
    VITE_GOOGLE_API_KEY=your_gemini_api_key_here
    ```

### 4. Ignite the Engine 🔥

Start the development server with Hot Module Replacement (HMR).

```bash
npm run dev
```
> The application will launch at `http://localhost:5173`

---

## 🛠️ Script Command Center

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | **Start Dev Server** | Launches local development environment. |
| `npm run build` | **Production Build** | Compiles TypeScript and optimizes assets for deployment. |
| `npm run preview` | **Preview Build** | Locally preview the production build. |

---

## 📂 Project Anatomy

```tree
src/
├── components/    # 🧱 Core UI Blocks (Analysis Dashboard, Landing Page, Diagrams)
├── services/      # 🧠 Intelligence Layer (Gemini API Integration)
├── utils/         # 🔧 Utilities (URL Validators, Formatters)
├── types.ts       # 📐 Type Definitions & Interfaces
└── App.tsx        # ⚛️ Application Entry Point
```

---

## 🤝 Contributing

1.  **Fork** the repository.
2.  **Create** a feature branch (`git checkout -b feature/matrix-mode`).
3.  **Commit** your changes.
4.  **Push** to the branch.
5.  **Open** a Pull Request.

---
<p align="center">
  Developed by <strong>Swetang Gajjar</strong> • Archi-Tech Platform
</p>
