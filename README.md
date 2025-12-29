# Financial Trend Analysis & Forecasting System

A full-stack AI system that analyzes Reddit financial discussions using **NVDM** (Topic Modeling) and **FinBERT** (Emotion Classification).

## 🏗 Architecture
- **Inference**: PyTorch (NVDM) + HuggingFace (FinBERT)
- **Backend API**: FastAPI (Python) located in `/scripts`
- **Frontend**: Next.js 14 (Root)
- **Database**: SQLite (No installation required)

## 🚀 Setup Instructions

### 1. Python Setup
```bash
pip install -r scripts/requirements.txt
```

### 2. Run the Data Pipeline
In a terminal:
```bash
# 1. Fetch data from Reddit (Public JSON)
python scripts/scraper.py

# 2. Analyze data (Train NVDM + Classify Emotions)
python scripts/analysis_engine.py

# 3. Start the API Server
python scripts/main.py
```
*Server runs on localhost:8000*

### 3. Run the Dashboard
In a separate terminal (from root):
```bash
npm install
npm run dev
```
*Visit **http://localhost:3000***

## 📁 Project Structure
- **/scripts**: Python backend, scraper, and ML models.
- **/app**: Next.js App Router pages.
- **/components**: React UI components.
