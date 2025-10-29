# LifeGuard.AI: Intelligent Disaster Alerts

<p align="center">
  <img src="https." alt="LifeGuard.AI application screenshot" width="400"/>
  <br/>
  <em>An intelligent disaster alert system powered by the Google Gemini API.</em>
</p>

LifeGuard.AI is a sophisticated web application designed to provide users with real-time risk assessments, predictive analysis, and AI-driven safety recommendations. It leverages the powerful and diverse capabilities of the Google Gemini API to create a comprehensive and interactive disaster preparedness tool.

## ✨ Key Features

-   **Predictive Dashboard**: At-a-glance overview of current and predicted risks for various disaster types like floods, storms, and earthquakes.
-   **Grounded Map Analysis**: Utilizes the user's geolocation to provide real-time weather data and an in-depth, AI-generated analysis of local environmental risks using Google Maps and Search grounding.
-   **Multimodal Damage Reports**: Users can upload photos of infrastructure damage, and the Gemini vision model will analyze the image to identify the type of damage, estimate its severity, and highlight key concerns.
-   **Incident Reporting**: A full CRUD interface for users to manually submit, edit, and delete incident reports.
-   **Live Voice Assistant**: A real-time, conversational AI assistant built with the Gemini Live API for hands-free inquiries and support. It features live transcription for both user and AI speech.
-   **Data Analytics**: A dedicated screen visualizes historical alert data, showing trends in frequency, type, and severity through interactive charts and graphs.
-   **Responsive & Themed UI**: A mobile-first, responsive design with a sleek dark mode, built with Tailwind CSS.

## 🚀 Gemini API Features Showcased

This application serves as a practical demonstration of several advanced features of the `@google/genai` SDK:

| Feature                  | Model Used                                    | Implementation Location      |
| ------------------------ | --------------------------------------------- | ---------------------------- |
| **Multimodal Input**     | `gemini-2.5-flash`                            | **Reports > Analyze Damage** |
| **Grounding (Search/Maps)** | `gemini-2.5-flash`                            | **Map > Analyze Area**       |
| **Live Conversation**    | `gemini-2.5-flash-native-audio-preview-09-2025` | **Dashboard > Voice Assistant** |
| **Chat Session**         | `gemini-2.5-flash`                            | `services/geminiService.ts`  |
| **Text-to-Speech**       | `gemini-2.5-flash-preview-tts`                  | `services/geminiService.ts`  |

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`)
-   **Routing**: React Router
-   **Charts**: Recharts

## 🔧 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/lifeguard-ai.git
    cd lifeguard-ai
    ```

2.  **Set up your API Key:**
    The application loads the Google Gemini API key from the environment variable `process.env.API_KEY`. You will need to obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

3.  **Run the application:**
    This project is designed to run in a development environment like AI Studio, which automatically handles dependencies and environment variables. If running elsewhere, ensure you have Node.js installed and manage dependencies with `npm` or `yarn`.

## 📂 Project Structure

The codebase is organized to be clean, scalable, and maintainable.
