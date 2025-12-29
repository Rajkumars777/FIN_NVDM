# Financial Trend Analysis & Forecasting System

A full-stack AI system that analyzes financial discussions from multiple sources (Reddit, News, YouTube, etc.) using AI models for sentiment analysis and relevance filtering.

## 🏗 Architecture
- **Frontend**: Next.js 14 (App Router)
- **Data Pipeline**: Python scripts for fetching and analyzing data
- **AI Models**: DistilBERT (Gatekeeper) + FinBERT (Sentiment Analysis)
- **Database**: MongoDB

## 🚀 Setup Instructions

### 1. Prerequisites
- **Node.js**: Install Node.js (v18 or higher)
- **Python**: Install Python (v3.8 or higher)
- **MongoDB**: Install MongoDB or use a cloud instance (Atlas)

### 2. Environment Setup
Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/financial_sentiment_db
# Add other necessary keys if any (e.g., FINNHUB_API_KEY for frontend features)
```

### 3. Python Data Pipeline Setup
The Python pipeline fetches data from various sources, analyzes it using AI models, and saves it to MongoDB.

1. Install Python dependencies:
   ```bash
   pip install -r scripts/requirements.txt
   ```

2. Run the Data Pipeline:
   ```bash
   python scripts/fetch_financial_posts.py
   ```
   *Note: This script will download necessary AI models (approx 1-2GB) on the first run.*

### 4. Frontend Application Setup
The Next.js application serves the dashboard and connects to MongoDB to display the analyzed data.

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Run the Development Server:
   ```bash
   npm run dev
   ```

3. Open your browser and visit:
   http://localhost:3000

## 📁 Project Structure
- **/scripts**: Python data fetching and analysis scripts.
  - `fetch_financial_posts.py`: Main script to fetch and analyze data.
  - `utils/ai_client.py`: AI model wrapper (DistilBERT + FinBERT).
- **/app**: Next.js App Router pages.
- **/components**: React UI components.
- **/lib**: Utility functions and database connections.
