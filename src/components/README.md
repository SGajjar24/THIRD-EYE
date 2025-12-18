# 🧱 Components Library

This directory contains the React functional components that build the Third Eye user interface.

## Core Components

| Component | Description |
| :--- | :--- |
| **`LandingPage.tsx`** | The main entry point featuring the 3D parallax background, URL input form, and report type selector. |
| **`AnalysisDashboard.tsx`** | The results view that displays the audit score, "Ask the Architect" chat interface, and detailed findings. |
| **`ReportGenerator.tsx`** | Handles the logic for compiling analysis data into a downloadable HTML report. |
| **`LiveCheckoutPrototype.tsx`** | A simulation engine to test e-commerce checkout flows and data persistence logic. |

## Interactive Elements
- **`AskTheArchitect.tsx`**: The chat interface powered by Gemini 3 Pro.
- **`CheckoutFlowDiagram.tsx`**: A dynamic visualizer for e-commerce transaction steps.

## Styling
All components use **Tailwind CSS** for styling, with custom animations defined in `index.css`.
