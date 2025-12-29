
import random
import re
try:
    from transformers import pipeline
except ImportError:
    pipeline = None

class AgriAIClient:
    """
    AI Client with DistilBERT Gatekeeper for Financial Relevance.
    """
    def __init__(self):
        self.classifier = None
        try:
            if pipeline:
                print("      🧠 Loading AI Model (DistilBERT Gatekeeper)...")
                # Using typeform's distilled model (~260MB) - standard and reliable
                self.classifier = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")
            else:
                print("      ⚠️ Transformers not installed. Using keyword fallback.")
        except Exception as e:
            print(f"      ⚠️ Model Load Error: {e}. Using keyword fallback.")

        self.positive_words = [
            "surge", "record", "profit", "gain", "bull", "growth", "high", "beat", "up", "green", 
            "jump", "rally", "soar", "optimistic", "strong", "outperform", "buy", "long"
        ]
        self.negative_words = [
            "crash", "loss", "drop", "bear", "recession", "down", "red", "miss", "inflation", 
            "crisis", "slump", "plummet", "weak", "sell", "collapse", "debt", "short"
        ]

    def analyze(self, text):
        """
        Analyzes text for financial sentiment and relevance using DistilBERT.
        """
        text_lower = text.lower()
        is_relevant = True
        sentiment = "Neutral"
        confidence = 0.85
        
        # --- 1. DistilBERT Gatekeeper ---
        if self.classifier:
            try:
                # Labels to distinguish finance from noise
                candidate_labels = [
                    "financial market and economy", 
                    "personal life and relationships", 
                    "entertainment and movies", 
                    "gaming",
                    "general discussion"
                ]
                
                result = self.classifier(text, candidate_labels)
                top_label = result['labels'][0]
                top_score = result['scores'][0]
                
                # Strict Gatekeeper Rule
                if top_label != "financial market and economy":
                    print(f"        [AI Filter] Skipped: '{text[:40]}...' ({top_label}: {top_score:.2f})")
                    return {"is_relevant": False, "sentiment_class": "Neutral", "confidence": 0, "summary": ""}
                
                confidence = top_score
                
            except Exception as e:
                print(f"      ⚠️ AI Error: {e}")
                # Fallback to keywords if model fails specific text
        
        # --- 2. Keyword Fallback (if model missing/failed) or Sentiment Logic ---
        
        score = 0
        for word in self.positive_words:
            if word in text_lower: score += 1
        for word in self.negative_words:
            if word in text_lower: score -= 1
        
        if score > 0: sentiment = "Positive"
        elif score < 0: sentiment = "Negative"
        
        # Double check relevance with keywords if model wasn't used
        if not self.classifier:
            finance_keywords = ["stock", "market", "price", "economy", "trade", "invest", "money", "bank", "crypto", "fund", "inflation", "rates", "federal", "reserve", "finance"]
            # Added 'finance' but strict context issues might remain if using keywords only.
            # But the model should ideally load.
            if not any(k in text_lower for k in finance_keywords):
                is_relevant = False

        return {
            "is_relevant": is_relevant,
            "sentiment_class": sentiment,
            "confidence": confidence,
            "summary": text[:100] + "..."
        }
