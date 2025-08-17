# Synchronicities

✨ *Capture the cosmos, decode the coincidences.* ✨

Synchronicities is a modern web application designed to help you record, analyze, and find deeper meaning in the meaningful coincidences that grace your life. By blending intuitive design with the power of generative AI, this app transforms your personal journal into an insightful dashboard of patterns and reflections.

![Synchronicities App Screenshot](https://placehold.co/800x400.png?text=Synchronicities+App)
*<p align="center">A glimpse into the Synchronicities dashboard.</p>*

---

## Core Features

-   **Seamless Event Entry**: Quickly capture synchronicity events with all the essential details: the number or sign, date, time, location, your emotional state, and even an optional photo.
-   **AI-Powered Insights**: Leverage the power of Google's Gemini model via Genkit to receive insightful, concise interpretations of your recorded events, helping you uncover potential meanings and messages.
-   **Analytics Dashboard**: Visualize the patterns in your life with a clean and simple dashboard. Track the frequency of numbers and signs to see what the universe might be emphasizing.
-   **Comprehensive History**: An elegant, accordion-style table allows you to review all your past entries, along with their associated AI insights and details, at a glance.
-   **Secure & Personal**: With Firebase Authentication, your journal is personal and secure. All your recorded events are tied to your account.

## Tech Stack

This project is built on a modern, robust, and scalable technology stack:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models.
-   **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication)
-   **Data Visualization**: [Recharts](https://recharts.org/)
-   **Internationalization**: [next-intl](https://next-intl.dev/)

---

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A Firebase project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Firebase Setup

This application requires a Firebase project to handle authentication and to power its generative AI features.

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication**: In your new Firebase project, navigate to the **Authentication** section and enable the **Google** sign-in method.
3.  **Create a Web App**: In your project settings, add a new Web App (`</>`) to get your Firebase configuration object.
4.  **Update Firebase Config**: Copy the `firebaseConfig` object provided and paste it into the `src/lib/firebase.ts` file, replacing the placeholder values.
5.  **Set up Genkit (Google AI)**:
    *   Go to the [Google AI Studio](https://aistudio.google.com/) and create an API key.
    *   Create a file named `.env` in the root of your project.
    *   Add your API key to the `.env` file like this:
        ```
        GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```

### Running the Development Server

Once your dependencies are installed and your environment variables are set, you can run the development server:

```bash
npm run dev
```

This will start two processes concurrently:
- The Next.js application on `http://localhost:9002`
- The Genkit development server for your AI flows

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
