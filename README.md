# Elyx Journey Visualizer

This is an interactive application built with Next.js and Genkit to visualize and analyze a member's 8-month health journey.

## Overview

The Elyx Journey Visualizer provides a comprehensive suite of tools to understand the health and wellness progression of a member named Rohan Patel. It combines a data-rich dashboard with an AI-powered chat interface, allowing users to not only see the quantitative data but also explore the qualitative narrative and decision-making process behind the journey.

## Features

*   **Health Journey Dashboard**:
    *   Displays key performance indicators (KPIs) like doctor consultation hours, health coach sessions, and plan adherence.
    *   Visualizes the member's progress across five key health pillars using an interactive chart.
    *   Presents a detailed, month-by-month breakdown of the journey in an accordion view, showing goals, friction points, and outcomes.

*   **AI-Powered Chat Simulation & Analysis**:
    *   **Generate Conversation**: With a single click, the application uses a Genkit AI flow to generate a realistic 8-month communication history between the member and his dedicated health team.
    *   **Analyze Conversation**: Users can ask questions about the generated conversation (e.g., "Summarize this chat," "Why was his plan changed in August?") and receive AI-driven answers. The AI uses both the chat content and the underlying journey data to provide insightful responses that explain the "why" behind decisions.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
*   **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Charts**: [Recharts](https://recharts.org/)

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/wiz4rdd/elyx-hackathon
    cd elyx-hackathon
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_google_ai_api_key
    ```

### Running the Development Server

You need to run two separate processes for the Next.js app and the Genkit AI flows.

1.  **Start the Genkit development server:**
    Open a terminal and run:
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit development server, which hosts your AI flows.

2.  **Start the Next.js application:**
    In a second terminal, run:
    ```bash
    npm run dev
    ```

3.  **Open the application:**
    Open https://elyx-hackathon-sigma.vercel.app/dashboard in your browser to see the application.

## Project Structure

*   `src/app/`: Contains the main pages and layouts for the Next.js application.
    *   `src/app/(main)/dashboard/page.tsx`: The main dashboard page.
    *   `src/app/(main)/chat/page.tsx`: The chat simulation and analysis page.
*   `src/components/`: Reusable React components.
    *   `src/components/ui/`: Components from ShadCN UI.
*   `src/ai/`: Contains all Genkit-related code.
    *   `src/ai/flows/`: Genkit flows for generating messages and analyzing chat.
*   `src/lib/`: Contains utility functions and data sources.
    *   `src/lib/data.ts`: Core data like member persona, team roles, and interaction logs.
    *   `src/lib/monthwise-data.ts`: Detailed monthly journey summaries.
