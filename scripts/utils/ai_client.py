
import io
import torch
import torch.nn.functional as F
try:
    from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
except ImportError:
    pipeline = None

class AgriAIClient:
    """
    AI Client with:
    1. DistilBERT Gatekeeper (Relevance Filter)
    2. FinBERT (Financial Sentiment Analysis)
    """
    def __init__(self):
        self.classifier = None   # Gatekeeper
        self.tokenizer = None    # FinBERT
        self.model = None        # FinBERT
        
        try:
            if pipeline:
                print("      🧠 Loading AI Models...")
                print("        1. [Gatekeeper] Loading DistilBERT...")
                self.classifier = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")
                
                print("        2. [Sentiment] Loading FinBERT (ProsusAI)...")
                self.tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
                self.model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")
                self.model.eval() # Set to evaluation mode
            else:
                print("      ⚠️ Transformers not installed. Using fallback.")
        except Exception as e:
            print(f"      ⚠️ Model Load Error: {e}. Using fallback.")

    def analyze(self, text):
        """
        Analyzes text using DistilBERT for relevance and FinBERT for sentiment.
        """
        if not text: return None
        
        is_relevant = True
        sentiment = "Neutral"
        confidence = 0.0
        
        # --- 1. DistilBERT Gatekeeper ---
        if self.classifier:
            try:
                candidate_labels = [
                    "financial market and economy", 
                    "personal life and relationships", 
                    "entertainment and movies", 
                    "gaming",
                    "general discussion"
                ]
                
                # Fast checking for very short text to avoid overhead
                if len(text.split()) < 3: 
                    return {"is_relevant": False, "sentiment_class": "Neutral", "confidence": 0, "summary": ""}

                result = self.classifier(text, candidate_labels)
                top_label = result['labels'][0]
                top_score = result['scores'][0]
                
                # Strict Gatekeeper Rule (0.4 threshold for robust filtering)
                if top_label != "financial market and economy" and top_score > 0.4:
                    # print(f"        [AI Filter] Skipped: '{text[:40]}...' ({top_label}: {top_score:.2f})")
                    return {"is_relevant": False, "sentiment_class": "Neutral", "confidence": 0, "summary": ""}
                
            except Exception as e:
                print(f"      ⚠️ Gatekeeper Error: {e}")
        
        # --- 2. FinBERT Sentiment Analysis ---
        if self.tokenizer and self.model:
            try:
                inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
                with torch.no_grad():
                    outputs = self.model(**inputs)
                
                # FinBERT Output: [positive, negative, neutral] (Check config, usually: 0=positive, 1=negative, 2=neutral OR similar)
                # Actually ProsusAI/finbert labels are: {0: 'positive', 1: 'negative', 2: 'neutral'}
                # Let's verify mapping dynamically
                labels = self.model.config.id2label
                
                scores = F.softmax(outputs.logits, dim=1)
                max_score, max_index = torch.max(scores, dim=1)
                
                sentiment_label = labels[max_index.item()] # 'positive', 'negative', 'neutral'
                confidence = max_score.item()
                
                # Capitalize for frontend consistency
                sentiment = sentiment_label.capitalize() 
                
            except Exception as e:
                print(f"      ⚠️ FinBERT Error: {e}")
                sentiment = "Neutral"
        
        # Fallback if models failed
        else:
             sentiment = "Neutral"

        return {
            "is_relevant": is_relevant,
            "sentiment_class": sentiment,
            "confidence": confidence,
            "summary": text[:100] + "..."
        }
