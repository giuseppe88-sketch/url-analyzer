# URL Analyzer 🌐

URL Analyzer is a full-stack web application that allows users to submit a URL and receive a detailed analysis of its on-page SEO and technical characteristics. The application features a Go backend for high-performance analysis and a modern React frontend for a seamless user experience.

This project is designed to showcase a clean, scalable, and well-documented codebase, perfect for portfolio review.

---

## ✨ Features

- **Concurrent URL Analysis**: Leverages Go's concurrency model to analyze URLs efficiently.
- **Detailed SEO Insights**: Provides key metrics including:
  - HTML Version
  - Page Title
  - Headings Breakdown (H1, H2, etc.)
  - Internal vs. External Link Counts
  - List of Inaccessible Links
  - Detection of Login Forms
- **Modern, Responsive UI**: A clean and intuitive user interface built with React, TypeScript, and Material-UI.
- **Persistent History**: All analysis results are saved and displayed in a data grid for future reference.
- **Real-time Feedback**: The UI provides real-time loading states, error messages, and the ability to cancel requests.

---

## 🛠️ Tech Stack

| Category       | Technology                                    |
| -------------- | --------------------------------------------- |
| **Backend**    | Go, Gin, Goquery (Scraping)  |
| **Frontend**   | React, TypeScript, Vite, Zustand (State Mgmt) |
| **UI Library** | Material-UI (MUI)                             |
| **Database**   | MySQL                                    |
| **Container**  | Docker, Docker Compose                        |

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) must be installed on your system.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/giuseppe88-sketch/url-analyzer.git
    cd url-analyzer
    ```

2.  **Run the application with Docker Compose:**

    This single command will build the images for the frontend and backend, start all the necessary containers (including the database), and run the application.

    ```bash
    docker-compose up --build
    ```

3.  **Access the application:**

    - The **Frontend** will be available at [http://localhost:5173](http://localhost:5173)
    - The **Backend API** will be running at `http://localhost:8080`

---

## 📝 Usage

1.  Open your web browser and navigate to `http://localhost:5173`.
2.  Enter a valid URL (e.g., `https://google.com`) into the input field.
3.  Click the "Analyze" button.
4.  View the results as they appear in the data grid below.
5.  Click on any result in the table to see a detailed breakdown of the analysis.

---


