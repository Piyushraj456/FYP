<div align="center">

# ⚖️ LegalEase

### AI-Powered Legal Document Vulnerability Detection & Risk Analysis System

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

*An end-to-end automated system for vulnerability detection, clause classification, and risk assessment in legal documents — designed to empower non-legal users with clear, actionable insights.*

</div>

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [System Architecture](#️-system-architecture)
4. [Tech Stack](#-tech-stack)
5. [System Workflow](#-system-workflow)
6. [Installation & Setup](#-installation--setup)
7. [Environment Variables](#-environment-variables)
8. [API Reference](#-api-reference)
9. [Evaluation Metrics](#-evaluation-metrics)
10. [Research Background](#-research-background)
11. [Team](#-team)
12. [Acknowledgements](#-acknowledgements)

---

## 📖 Project Overview

Legal documents — contracts, service agreements, procurement tenders, memoranda of understanding, and regulatory filings — contain complex, specialized language that is often inaccessible to non-legal users. A minor ambiguity or missing element in such documents can lead to significant financial risk, operational disruptions, or non-compliance.

**LegalEase** addresses this problem by providing an automated, intelligent system that:

- Accepts **any legal document** in multiple formats (PDF, scanned images, etc.)
- Performs **layout-preserving OCR** and text extraction
- **Segments** text into legally meaningful clause units
- **Classifies** each clause by type and legal significance
- **Detects vulnerabilities** using a hybrid rule-based + machine learning engine
- **Generates plain-language explanations** and actionable remediation suggestions
- Produces a **comprehensive risk report** with an interpretable contract-level rating

> This project was developed as a **Final Year Capstone Project** at the undergraduate level, combining cutting-edge NLP research with practical software engineering.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📄 **Multi-format Ingestion** | Accepts PDF, scanned documents; performs OCR for image-based files |
| 🔍 **Clause Segmentation** | Identifies and isolates legally meaningful clause boundaries |
| 🏷️ **Clause Classification** | Labels clause types (indemnity, liability, termination, IP, etc.) |
| 🛡️ **Vulnerability Detection** | Multi-label detection of risky, ambiguous, or missing provisions |
| 📊 **Risk Scoring** | Aggregated contract-level risk rating with clause-level drill-down |
| 🤖 **LLM Summarization** | Plain-English summaries and recommendations powered by Google Gemini |
| 🧠 **Explainability** | Evidence spans and reasoning highlights for every flagged issue |
| 👤 **User Authentication** | Secure JWT-based login and session management |
| ☁️ **Cloud Storage** | Document upload and retrieval via UploadThing |

---

## 🏛️ System Architecture

LegalEase employs a **microservices architecture** where each subsystem owns a distinct part of the document analysis pipeline. This decoupled design enables independent scaling, fast iteration, and secure orchestration of NLP/LLM components.

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│              React 19 + TailwindCSS 4 + Vite                   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP / REST
┌────────────────────────────▼────────────────────────────────────┐
│                   BACKEND ORCHESTRATION LAYER                   │
│               Node.js + Express 5 (Auth, Routing)               │
│         JWT Auth │ Multer Uploads │ UploadThing Storage          │
└────────────────────────────┬────────────────────────────────────┘
                             │ Internal API Call
┌────────────────────────────▼────────────────────────────────────┐
│                      NLP / AI SERVICE LAYER                     │
│                   FastAPI 0.104.1 + Uvicorn                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  PDF Parser  │  │  NLP Engine  │  │    Risk Engine (Hybrid) │ │
│  │  pdfplumber  │  │    spaCy     │  │  Rules + ML Embeddings  │ │
│  │  + OCR       │  │  NER, Regex  │  │  Vulnerability Detect.  │ │
│  └──────────────┘  └──────────────┘  └────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         LLM Summarization (Google Gemini API)            │   │
│  │   Plain-language summaries · Recommendations · Reports   │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                         DATA LAYER                              │
│         MongoDB (via Mongoose) · UUID-tagged Document Store     │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Descriptions

**Frontend Layer** — React 19 SPA providing document upload, progress tracking, clause visualization, and interactive risk dashboards.

**Backend Orchestration** — Express 5 server handling user authentication (JWT + bcrypt), file routing (Multer + UploadThing), and forwarding requests to the FastAPI NLP service.

**NLP / AI Service** — FastAPI microservice handling all intelligent document processing. Stateless and independently scalable.

**Data Layer** — MongoDB stores user accounts, document metadata, analysis results, and UUID-tagged document states via Python dataclasses for trusted state management.

---

## 🛠️ Tech Stack

### Frontend

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.1.1 | Core UI framework |
| `react-dom` | ^19.1.1 | DOM rendering |
| `react-router-dom` | ^7.8.2 | Client-side routing |
| `tailwindcss` | ^4.1.12 | Utility-first styling |
| `@tailwindcss/typography` | ^0.5.16 | Rich text rendering |
| `axios` | ^1.11.0 | HTTP client |
| `lucide-react` | ^0.542.0 | Icon library |
| `marked` | ^16.2.1 | Markdown rendering |
| `dompurify` | ^3.2.6 | XSS sanitization |
| `react-toastify` | ^11.0.5 | Notifications |
| `react-fast-marquee` | ^1.6.5 | Animated banners |
| `@uploadthing/react` | ^7.3.3 | File upload UI |

### Backend (Node.js)

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.1.0 | Web framework |
| `mongoose` | ^8.18.0 | MongoDB ODM |
| `jsonwebtoken` | ^9.0.2 | JWT authentication |
| `bcryptjs` | ^3.0.2 | Password hashing |
| `multer` | ^2.0.2 | File upload middleware |
| `uploadthing` | ^7.7.4 | Cloud file storage |
| `cors` | ^2.8.5 | Cross-origin resource sharing |
| `dotenv` | ^17.2.2 | Environment config |
| `nodemon` | ^3.1.10 | Dev auto-restart |

### AI / NLP Service (Python / FastAPI)

| Package | Version | Purpose |
|---|---|---|
| `fastapi` | 0.104.1 | Async API framework |
| `uvicorn[standard]` | 0.24.0 | ASGI server |
| `pdfplumber` | 0.10.3 | PDF text & layout extraction |
| `spacy` | 3.7.2 | NLP pipeline (NER, tokenization, segmentation) |
| `google-generativeai` | 0.3.2 | Google Gemini LLM API |
| `pydantic` | 2.5.0 | Data validation & schemas |
| `python-multipart` | 0.0.6 | File upload parsing |
| `dataclasses-json` | 0.6.3 | Serializable state management |
| `python-dotenv` | 1.0.0 | Environment variable loading |

---

## 🔄 System Workflow

The LegalEase pipeline processes documents through three clean stages:

```
                        ┌─────────────────┐
                        │   User Upload   │
                        │   (any format)  │
                        └────────┬────────┘
                                 │
              ┌──────────────────▼──────────────────┐
              │     STAGE 1: INGESTION & PARSING     │
              │                                      │
              │  • Text extraction via pdfplumber    │
              │  • OCR for scanned/image documents   │
              │  • Text cleaning & normalization     │
              │  • Clause boundary detection         │
              └──────────────────┬──────────────────┘
                                 │
              ┌──────────────────▼──────────────────┐
              │   STAGE 2: ANALYSIS & RISK ENGINE   │
              │                                      │
              │  • Clause type classification        │
              │  • Named Entity Recognition (spaCy)  │
              │  • Rule-based vulnerability checks   │
              │  • ML embedding-based risk scoring   │
              │  • Structural inconsistency flagging │
              └──────────────────┬──────────────────┘
                                 │
              ┌──────────────────▼──────────────────┐
              │    STAGE 3: REPORT GENERATION        │
              │                                      │
              │  • LLM plain-language summary        │
              │  • Clause-level explanations         │
              │  • Consolidated risk score           │
              │  • Actionable recommendations        │
              └──────────────────┬──────────────────┘
                                 │
                        ┌────────▼────────┐
                        │  Risk Report &  │
                        │   Dashboard     │
                        └─────────────────┘
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.10+
- **MongoDB** (local or Atlas URI)
- **Google Gemini API Key**

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-org/legalease.git
cd legalease
```

---

### Step 2 — Set Up the Python / FastAPI Service

```bash
cd server-python

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download the spaCy language model
python -m spacy download en_core_web_sm
```

**Start the FastAPI server:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The NLP service will be available at: `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

---

### Step 3 — Set Up the Node.js Backend

```bash
cd ../server-node

# Install dependencies
npm install

# Start the server (development)
npm start
```

The Express server will be available at: `http://localhost:5000`

---

### Step 4 — Set Up the React Frontend

```bash
cd ../client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## 🔐 Environment Variables

### Node.js Backend (`server-node/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
FASTAPI_URL=http://localhost:8000
```

### Python FastAPI Service (`server-python/.env`)

```env
GOOGLE_API_KEY=your_google_gemini_api_key
```

### React Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_UPLOADTHING_APP_ID=your_uploadthing_app_id
```

---

## 📡 API Reference

### Authentication Endpoints (Node.js)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `GET` | `/api/auth/me` | Get current user profile |

### Document Endpoints (Node.js)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/documents/upload` | Upload a legal document |
| `GET` | `/api/documents` | List all uploaded documents |
| `GET` | `/api/documents/:id` | Get document metadata |
| `DELETE` | `/api/documents/:id` | Delete a document |

### Analysis Endpoints (FastAPI)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze` | Analyze a document (full pipeline) |
| `POST` | `/classify` | Classify clauses only |
| `POST` | `/extract` | Extract text from PDF |
| `GET` | `/health` | Service health check |

---

## 📊 Evaluation Metrics

The LegalEase system is evaluated across four dimensions:

### 1. Clause Classification

| Metric | Formula |
|---|---|
| **Precision** | Correct predicted clauses / Total predicted clauses |
| **Recall** | Correct predicted clauses / Total actual clauses |
| **F1-Score** | Harmonic mean of Precision and Recall |

### 2. Vulnerability Detection

Multi-label detection evaluated using:
- **Micro F1** — balanced across all vulnerability types
- **Macro F1** — equal weight per class, tests coverage of rare risks
- **Recall@K** — fraction of true vulnerabilities found in top-K predictions

### 3. Summarization Quality

- **Clarity Score** — readability assessed via Flesch-Kincaid grade level
- **Relevance** — semantic similarity between generated summary and source clauses
- **User Comprehension** — qualitative user study metric

### 4. Risk Scoring

- **Agreement Rate** — alignment of system risk rating with expert legal assessor ratings
- **Rank Correlation** — Spearman's ρ between system and human risk rankings

---

## 📚 Research Background

This project is grounded in published research at the intersection of **Legal NLP**, **Document Intelligence**, and **Explainable AI**. Key areas informing our design:

- **Domain-specific language models** (LegalBERT, Blackstone) for improved clause-level understanding
- **CUAD (Contract Understanding Atticus Dataset)** — expert-annotated benchmark for contract clause extraction
- **LEDGAR** — large-scale automatically labeled legal provision corpus
- **Sparse-attention transformers** and **hierarchical encoders** for long-document modeling
- **Layout-aware document models** for handling heterogeneous PDF formatting
- **Hybrid rule–ML architectures** for balancing precision on high-severity items with ML generalization

### Challenges Addressed

| Challenge | Our Approach |
|---|---|
| Long-document truncation | Hierarchical clause segmentation before encoding |
| OCR variability | Layout-preserving pdfplumber + fallback OCR pipeline |
| Label noise in large corpora | Conservative rule-based checks for high-severity items |
| Explainability requirements | Evidence span highlighting + reasoning traces |
| Jurisdictional generalization | Rule customization hooks per document type |

---

## 👥 Team

This project was developed as a Final Year University Project by:

| # | Name | Role |
|---|---|---|
| 1 | **Harsh Kumar Singh** | Team Lead · Full Stack Architecture · NLP Integration |
| 2 | **Piyush Raj** | Backend Development · API Design · Database Engineering |
| 3 | **Prasoon Krishan Gupta** | AI/ML Pipeline · FastAPI Service · Risk Engine |
| 4 | **Omvrit Chitrada** | Frontend Development · UI/UX Design · Report Generation |

---

## 🙏 Acknowledgements

- [CUAD Project](https://www.atticusprojectai.org/cuad) — Contract Understanding Atticus Dataset
- [spaCy](https://spacy.io/) — Industrial-strength NLP library
- [Google Gemini](https://deepmind.google/technologies/gemini/) — Large language model API
- [pdfplumber](https://github.com/jsvine/pdfplumber) — PDF extraction library
- [UploadThing](https://uploadthing.com/) — File upload infrastructure
- Our faculty advisors and mentors for their invaluable guidance throughout this project

---

<div align="center">

**LegalEase** — *Making legal documents accessible to everyone.*

Made with ❤️ as a Final Year University Project

</div>
