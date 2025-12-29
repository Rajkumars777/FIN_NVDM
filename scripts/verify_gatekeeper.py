
import sys
import os

# Ensure we can import from local scripts
sys.path.append(os.path.join(os.getcwd(), 'scripts'))

from utils.ai_client import AgriAIClient

def test_gatekeeper():
    print("🚀 Initializing AI Client...")
    ai = AgriAIClient()
    
    test_cases = [
        {
            "text": "I'm currently at home watching the new episodes of Stranger Things and realized this show is way better with someone else on the couch. I work in finance but tonight implies comfy vibes.",
            "expected": False,
            "label": "Non-Financial (Dating/TV)"
        },
        {
            "text": "NVIDIA stock surges 5% after earnings report beats expectations. Analysts predict strong growth in AI sector.",
            "expected": True,
            "label": "Financial (Stock News)"
        },
        {
            "text": "The Federal Reserve might raise interest rates next month to combat inflation.",
            "expected": True,
            "label": "Financial (Macro)"
        },
        {
            "text": "Looking for a gym buddy in downtown Toronto. I like lifting and cardio.",
            "expected": False,
            "label": "Non-Financial (Personal)"
        }
    ]
    
    print("\n🧪 Running Gatekeeper Tests...\n")
    
    passed = 0
    for case in test_cases:
        print(f"   Input ({case['label']}): \"{case['text'][:60]}...\"")
        result = ai.analyze(case['text'])
        is_relevant = result['is_relevant']
        
        status = "✅ PASS" if is_relevant == case['expected'] else "❌ FAIL"
        print(f"   -> Result: {'Relevant' if is_relevant else 'Filtered'} | {status}\n")
        
        if is_relevant == case['expected']:
            passed += 1
            
    print(f"🏁 Result: {passed}/{len(test_cases)} Passed.")

if __name__ == "__main__":
    test_gatekeeper()
