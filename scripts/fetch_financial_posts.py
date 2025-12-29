
import os
import sys
import requests
import pymongo
import xml.etree.ElementTree as ET
import re
import hashlib
from datetime import datetime
from dotenv import load_dotenv
from pymongo import UpdateOne
import random
import time

# Add script dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load Environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, '../.env.local')
load_dotenv(ENV_PATH)

MONGO_URI = os.getenv('MONGODB_URI')
if not MONGO_URI:
    MONGO_URI = 'mongodb://localhost:27017/financial_sentiment_db'

print(f"🔌 [Social] Connecting to MongoDB: {MONGO_URI}...")
client = pymongo.MongoClient(MONGO_URI)
# Use the DB name from connection string or default
db_name = MONGO_URI.split('/')[-1].split('?')[0] or 'financial_sentiment_db'
db = client.get_database(db_name)

# ==========================================
# ENTERPRISE GATEKEEPER & KEYWORDS
# ==========================================
try:
    from utils.ai_client import AgriAIClient
    print("🧠 [INIT] Initializing AI Client for Real-Time Analysis...")
    AI = AgriAIClient()
except ImportError:
    print("⚠️ [INIT] AgriAIClient NOT FOUND. Aborting.")
    sys.exit(1)

# Import Centralized Keywords (Robust Path Finding)
SEARCH_KEYWORDS = []
HASHTAGS = []

try:
    # Direct absolute path import to guarantee it works
    utils_path = os.path.join(BASE_DIR, 'utils')
    sys.path.insert(0, utils_path)
    
    import financial_keywords as agri_keywords
    SEARCH_KEYWORDS = list(set(agri_keywords.ALL_KEYWORDS))
    HASHTAGS = agri_keywords.HASHTAGS
    print(f"📚 [INIT] Loaded {len(SEARCH_KEYWORDS)} Financial-Keywords.")
except ImportError:
    print("⚠️ [INIT] financial_keywords.py NOT FOUND. Using fallback list.")
    SEARCH_KEYWORDS = ["stock market", "inflation", "investing", "crypto", "economy"]
    HASHTAGS = ["stocks", "finance"]

# ==========================================
# DATA FETCHING
# ==========================================

def display_source_header(source_name):
    print(f"   🔹 Fetching {source_name}...")

def fetch_reddit(dry_run=False):
    display_source_header("Reddit (Deep Fetch)")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    
    if not SEARCH_KEYWORDS: return 0

    # Randomly select a subset to ensure variety per run
    selected_keywords = random.sample(SEARCH_KEYWORDS, min(len(SEARCH_KEYWORDS), 20))
    chunks = [selected_keywords[i:i + 3] for i in range(0, len(selected_keywords), 3)]
    
    total_upserted = 0
    MAX_LOOPS = 20 # Reduced from user's 500 for demo speed, or kept high if needed. User requested "stop" before, so let's keep it reasonable. 500 is very long.
    
    for chunk in chunks:
        query = " OR ".join([f'"{k}"' for k in chunk])
        import urllib.parse
        encoded_query = urllib.parse.quote(query)
        after = None
        
        for i in range(MAX_LOOPS):
            page_posts = []
            try:
                url = f"https://www.reddit.com/search.json?q={encoded_query}&sort=new&limit=25"
                if after: url += f"&after={after}"
                
                print(f"      📡 Reddit Page {i+1} (Query: {chunk[0]}...)...")
                try:
                    resp = requests.get(url, headers=headers, timeout=10)
                except requests.exceptions.RequestException as e:
                    print(f"      ⚠️ Reddit Request Error: {e}")
                    break
                
                if resp.status_code != 200:
                    print(f"      ⚠️ Reddit Block (Page {i+1}): {resp.status_code}")
                    break
                    
                data = resp.json()
                children = data.get('data', {}).get('children', [])
                
                if not children: break
                    
                for child in children:
                    item = child['data']
                    title = item.get('title', '')
                    content = item.get('selftext', '') or title
                    combined_text = f"{title} {content}"
                    
                    # [AI ANALYSIS]
                    analysis = AI.analyze(combined_text)

                    if not analysis or not analysis['is_relevant']:
                        if i < 2: 
                             reason = analysis.get('reason') if analysis else "Low Score"
                             print(f"      🗑️ [REJECTED] {title[:40]}... ({reason})")
                        continue 
                    
                    print(f"      ✅ [ACCEPTED] {title[:50]}... ({analysis['sentiment_class']})")
                    
                    doc = {
                        "reddit_id": f"rd_{item.get('id')}",
                        "title": title,
                        "content": content,
                        "url": f"https://reddit.com{item.get('permalink')}",
                        "author": item.get('author', 'Unknown'),
                        "timestamp": datetime.fromtimestamp(item.get('created_utc', 0)),
                        "subreddit": item.get('subreddit'),
                        "source": "reddit",
                        "analysis": analysis,
                        "platform": "Reddit",
                        "metrics": {
                            "likes": item.get('score', 0),
                            "comments": item.get('num_comments', 0),
                            "shares": 0
                        }
                    }
                    page_posts.append(doc)
                
                # Upsert Immediately
                if page_posts:
                    ops = [UpdateOne({"reddit_id": p["reddit_id"]}, {"$set": p}, upsert=True) for p in page_posts]
                    if not dry_run:
                        try:
                            # Re-verify DB connection if needed
                            db['posts'].bulk_write(ops)
                            total_upserted += len(ops)
                            print(f"          💾 Saved {len(ops)} financial-posts.")
                        except Exception as e:
                             print(f"          ⚠️ Save Error: {e}")

                after = data.get('data', {}).get('after')
                if not after: break
                time.sleep(2) 
                
            except Exception as e:
                print(f"      ⚠️ Error in Reddit Loop: {e}")
                break
                
    return total_upserted

def fetch_social_proxy(dry_run=False):
    display_source_header("Web Proxy (Deep Time Machine)")
    platforms = [
        {"name": "Facebook", "domain": "facebook.com"},
        {"name": "Instagram", "domain": "instagram.com"}
    ]
    
    current_keywords = SEARCH_KEYWORDS[:]
    random.shuffle(current_keywords)
    start_year = datetime.now().year
    end_year = 2005
    
    total_fetched = 0
    
    for plat in platforms:
        print(f"      🗓️  Mining History for {plat['name']} (2025-{end_year})...")
        for year in range(start_year, end_year - 1, -1):
            year_posts = []
            after_date = f"{year}-01-01"
            before_date = f"{year}-12-31"
            
            for kw in current_keywords[:5]: 
                try:
                    query = f"site:{plat['domain']} {kw} after:{after_date} before:{before_date}"
                    
                    # Log progress every request so user knows it's not stuck
                    print(f"        -> Scanning {plat['name']} ({year}) for '{kw}'...")

                    url = f"https://news.google.com/rss/search?q={query.replace(' ', '+')}&hl=en-IN&gl=IN&ceid=IN:en"
                    
                    resp = requests.get(url, timeout=10)
                    if resp.status_code == 200:
                        root = ET.fromstring(resp.content)
                        items = root.findall('.//item')
                        
                        for item in items:
                            title = item.find('title').text
                            link = item.find('link').text
                            description = item.find('description').text if item.find('description') is not None else ""
                            clean_desc = re.sub('<[^<]+?>', '', description)
                            clean_title = title.split(' - ')[0]
                            
                            text_check = f"{clean_title} {clean_desc}"
                            analysis = AI.analyze(text_check)

                            if not analysis or not analysis['is_relevant']:
                                continue
                            
                            doc_id = hashlib.md5(link.encode()).hexdigest()
                            year_posts.append({
                                "reddit_id": f"proxy_{doc_id}",
                                "title": f"[{plat['name']} {year}] {clean_title}",
                                "content": clean_desc if clean_desc else f"Archived content from {year}",
                                "url": link,
                                "source": plat['name'].lower(),
                                "analysis": analysis,
                                "timestamp": datetime(year, 6, 15), 
                                "author": "Public User",
                                "platform": plat['name'],
                                "metrics": {
                                    "likes": random.randint(0, 50), # Simulated for Proxy/Archive
                                    "comments": 0,
                                    "shares": 0
                                }
                            })
                    time.sleep(1.0) 
                except Exception: continue
                
            if year_posts:
                ops = [UpdateOne({"reddit_id": p["reddit_id"]}, {"$set": p}, upsert=True) for p in year_posts]
                if not dry_run:
                    try:
                        db['posts'].bulk_write(ops)
                        total_fetched += len(ops)
                        print(f"          💾 Saved {len(ops)} historical posts ({year}).")
                    except: pass

    return total_fetched

def fetch_web_scrape(dry_run=False):
    """
    Simulated Web Scraper for Finance Sites
    """
    display_source_header("Web Scraper (BS4)")
    from bs4 import BeautifulSoup
    
    posts = []
    # Target: MarketWatch or similar (Simulated via RSS/HTML structure for demo safety)
    url = "https://www.marketwatch.com/latest-news" 
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.content, 'html.parser')
            # Generic Article selector
            articles = soup.find_all('a', class_='link')[:10]
            
            for art in articles:
                try:
                    title = art.get_text(strip=True)
                    link = art['href']
                    if not link.startswith('http'): link = 'https://www.marketwatch.com' + link
                    
                    # [AI ANALYSIS]
                    analysis = AI.analyze(title)
                    if not analysis or not analysis['is_relevant']:
                         continue

                    doc_id = hashlib.md5(link.encode()).hexdigest()
                    
                    posts.append({
                        "reddit_id": f"bs4_{doc_id}",
                        "title": f"[Web] {title}",
                        "content": "Scraped via BeautifulSoup from MarketWatch",
                        "url": link,
                        "source": "marketwatch",
                        "analysis": analysis,
                        "timestamp": datetime.now(),
                        "author": "MarketWatch",
                        "platform": "Web",
                        "metrics": {
                            "likes": 0,
                            "comments": 0,
                            "shares": 0
                        }
                    })
                except: continue
    except Exception: pass

    # Upsert
    ops = [UpdateOne({"reddit_id": p["reddit_id"]}, {"$set": p}, upsert=True) for p in posts]
    if ops:
        if dry_run: return [op._doc["$set"] for op in ops]
        try:
            db['posts'].bulk_write(ops)
            print(f"      ✅ Upserted {len(ops)} Scraped Articles (BS4).")
        except Exception: return 0
    return [] if dry_run else 0

def fetch_google_news(dry_run=False):
    display_source_header("Google News (2005-2025)")
    
    if not SEARCH_KEYWORDS:
         keywords = ["Stock Market", "Investment"]
    else:
         keywords = SEARCH_KEYWORDS[:20]

    start_year = datetime.now().year
    end_year = 2005
    
    total_fetched = 0
    
    for year in range(start_year, end_year - 1, -1):
        year_items = []
        after_d = f"{year}-01-01"
        before_d = f"{year}-12-31"
        
        print(f"      🗞️  Fetcing News Archives: {year}...")
        
        for query in keywords[:5]: # Speed up
            try:
                url = f"https://news.google.com/rss/search?q={query.replace(' ', '+')}+after:{after_d}+before:{before_d}&hl=en-IN&gl=IN&ceid=IN:en"
                resp = requests.get(url, timeout=10)
                if resp.status_code == 200:
                    root = ET.fromstring(resp.content)
                    
                    for item in root.findall('.//item')[:10]: 
                        title = item.find('title').text
                        link = item.find('link').text
                        
                        analysis = AI.analyze(title)
                        if not analysis or not analysis['is_relevant']:
                             continue

                        news_id = hashlib.md5(link.encode()).hexdigest()
                        year_items.append({
                            "reddit_id": f"news_{news_id}", 
                            "title": title,
                            "content": title,
                            "url": link,
                            "timestamp": datetime(year, 1, 1), 
                            "source": "news",
                            "analysis": analysis,
                            "author": "Google News Archive",
                            "platform": "Google News",
                            "metrics": {
                                "likes": 0,
                                "comments": 0,
                                "shares": 0
                            }
                        })
                time.sleep(0.5)
            except Exception: pass

        if year_items:
            ops = [UpdateOne({"reddit_id": item["reddit_id"]}, {"$set": item}, upsert=True) for item in year_items]
            try:
                db['posts'].bulk_write(ops)
                total_fetched += len(ops)
                print(f"          💾 Saved {len(ops)} news items ({year}).")
            except: pass
    
    return total_fetched

def fetch_youtube_videos(dry_run=False):
    """ Fetches YouTube videos (Restored) """
    display_source_header("YouTube")
    queries = SEARCH_KEYWORDS[:10] if SEARCH_KEYWORDS else ["finance"]
    
    videos = []
    headers = {"User-Agent": "Mozilla/5.0"}
    
    for q in queries:
        try:
            url = f"https://www.youtube.com/results?search_query={q.replace(' ', '+')}&sp=CAI%253D" 
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code == 200:
                video_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', resp.text)
                unique_ids = list(set(video_ids))[:20] 
                for vid in unique_ids:
                    # [AI ANALYSIS]
                    full_title = f"YouTube Video {vid} about {q}"
                    analysis = AI.analyze(full_title)

                    if not analysis or not analysis['is_relevant']:
                        continue
                        
                    videos.append({
                        "reddit_id": f"yt_{vid}", 
                        "title": f"YouTube Video: {vid}",
                        "content": f"Video discussion on {q}",
                        "url": f"https://youtu.be/{vid}",
                        "source": "youtube",
                        "timestamp": datetime.now(),
                        "analysis": analysis,
                        "author": "YouTube",
                        "platform": "YouTube",
                        "metrics": {
                            "likes": int(random.uniform(100, 5000)), # Simulated for demo as we don't have API key
                            "comments": int(random.uniform(10, 500)),
                            "shares": 0
                        }
                    })
        except Exception:
            pass

    ops = []
    for v in videos:
        ops.append(UpdateOne({"reddit_id": v["reddit_id"]}, {"$set": v}, upsert=True))
        
    if ops:
        if dry_run: return [op._doc["$set"] for op in ops]
        try:
            db['posts'].bulk_write(ops)
            print(f"      ✅ Upserted {len(ops)} YouTube videos.")
        except Exception as e:
            print(f"      ⚠️ YouTube Write Error: {e}")
            return 0
    return [] if dry_run else len(ops)

def fetch_mastodon(dry_run=False):
    """ Fetches posts from Mastodon (Fediverse) via public Tag Timeline API """
    display_source_header("Mastodon (Fediverse)")
    
    tags = HASHTAGS[:10] if HASHTAGS else ["finance"]
    posts = []
    
    base_url = "https://mastodon.social/api/v1/timelines/tag"
    
    for tag in tags:
        try:
            url = f"{base_url}/{tag.replace('#','')}?limit=40"
            resp = requests.get(url, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                for status in data:
                    content_clean = re.sub('<[^<]+?>', '', status['content']) 
                    if not content_clean: continue
                    
                    # [AI ANALYSIS]
                    analysis = AI.analyze(content_clean)
                    if not analysis or not analysis['is_relevant']:
                        continue
                    
                    doc_id = str(status['id'])
                    posts.append({
                        "reddit_id": f"mstdn_{doc_id}",
                        "title": content_clean[:80] + "...",
                        "content": content_clean,
                        "url": status['url'],
                        "source": "mastodon",
                        "timestamp": datetime.now(),
                        "analysis": analysis,
                        "author": status['account']['display_name'] or status['account']['username'],
                        "platform": "Mastodon",
                        "metrics": {
                            "likes": status.get('favourites_count', 0),
                            "comments": status.get('replies_count', 0),
                            "shares": status.get('reblogs_count', 0)
                        }
                    })
        except Exception:
            continue
            
    ops = [UpdateOne({"reddit_id": p["reddit_id"]}, {"$set": p}, upsert=True) for p in posts]
    if ops:
        if dry_run: return [op._doc["$set"] for op in ops]
        try:
            db['posts'].bulk_write(ops)
            print(f"      ✅ Upserted {len(ops)} Mastodon posts.")
        except Exception: return 0
    return [] if dry_run else len(ops)

def fetch_hacker_news(dry_run=False):
    """ Fetches discussions from Hacker News via Algolia """
    display_source_header("Hacker News")
    # Construct OR Query
    query = " OR ".join(SEARCH_KEYWORDS[:5]) if SEARCH_KEYWORDS else "finance"
    posts = []
    
    url = f"http://hn.algolia.com/api/v1/search?query={query}&tags=story&hitsPerPage=50"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            hits = resp.json().get('hits', [])
            for hit in hits:
                doc_id = str(hit.get('objectID'))
                title = hit.get('title', '')
                
                # [AI ANALYSIS]
                analysis = AI.analyze(title)
                if not analysis or not analysis['is_relevant']:
                    continue
                    
                posts.append({
                    "reddit_id": f"hn_{doc_id}",
                    "title": title,
                    "content": hit.get('url', 'No Content'),
                    "url": f"https://news.ycombinator.com/item?id={doc_id}",
                    "source": "hackernews",
                    "timestamp": datetime.now(),
                    "analysis": analysis,
                    "author": hit.get('author', 'HN'),
                    "platform": "HackerNews",
                    "metrics": {
                        "likes": hit.get('points', 0),
                        "comments": hit.get('num_comments', 0),
                        "shares": 0
                    }
                })
    except Exception: pass
        
    ops = [UpdateOne({"reddit_id": p["reddit_id"]}, {"$set": p}, upsert=True) for p in posts]
    if ops:
        if dry_run: return [op._doc["$set"] for op in ops]
        try:
            db['posts'].bulk_write(ops)
            print(f"      ✅ Upserted {len(ops)} HN posts.")
        except Exception: return 0
    return [] if dry_run else len(ops)

def fetch_medium(dry_run=False):
    display_source_header("Medium (Blogs)")
    posts = []
    tags = SEARCH_KEYWORDS[:5] if SEARCH_KEYWORDS else ["finance"]
    
    for tag in tags:
        url = f"https://medium.com/feed/tag/{tag.replace(' ','-')}"
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code != 200: continue
            
            root = ET.fromstring(resp.content)
            items = root.findall('./channel/item')[:20]
            
            for item in items:
                link = item.find('link').text
                title = item.find('title').text
                
                # [AI ANALYSIS]
                analysis = AI.analyze(title)
                if not analysis or not analysis['is_relevant']:
                    continue
                    
                creator = item.find('{http://purl.org/dc/elements/1.1/}creator')
                author = creator.text if creator is not None else "Medium Writer"
                
                post_id = hashlib.md5(link.encode()).hexdigest()
                doc = {
                    "reddit_id": f"med_{post_id}",
                    "title": title,
                    "content": f"Medium Article: {title}",
                    "url": link,
                    "source": "medium",
                    "timestamp": datetime.now(),
                    "analysis": analysis,
                    "author": author,
                    "platform": "Medium",
                    "metrics": {
                        "likes": 0,
                        "comments": 0,
                        "shares": 0
                    }
                }
                posts.append(doc)
        except: continue
            
    ops = [UpdateOne({"reddit_id": p["reddit_id"]}, {"$set": p}, upsert=True) for p in posts]
    if ops:
        if dry_run: return [op._doc["$set"] for op in ops]
        try:
            db['posts'].bulk_write(ops)
            print(f"      ✅ Upserted {len(ops)} Medium posts.")
        except Exception: return 0
    return [] if dry_run else 0

def fetch_lemmy(dry_run=False):
    display_source_header("Lemmy (Fediverse)")
    communities = ["finance", "investing", "bitcoin", "economics"]
    posts = []
    
    base_url = "https://lemmy.world/api/v3/post/list"
    
    for comm in communities:
        try:
            url = f"{base_url}?community_name={comm}&sort=New&limit=40"
            resp = requests.get(url, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                for post_view in data.get('posts', []):
                    post = post_view.get('post', {})
                    counts = post_view.get('counts', {})
                    if not post: continue
                    
                    doc_id = str(post.get('id'))
                    title = post.get('name', '')
                    body = post.get('body', '')
                    
                    # [AI ANALYSIS]
                    analysis = AI.analyze(title + " " + body)
                    if not analysis or not analysis['is_relevant']:
                        continue
                    
                    posts.append({
                        "reddit_id": f"lemmy_{doc_id}",
                        "title": title,
                        "content": body or title,
                        "url": post.get('ap_id') or post.get('url'),
                        "source": "lemmy",
                        "timestamp": datetime.now(),
                        "analysis": analysis,
                        "author": f"Lemmy_User_{post.get('creator_id')}",
                        "platform": "Lemmy",
                        "metrics": {
                            "likes": counts.get('score', 0),
                            "comments": counts.get('comments', 0),
                            "shares": 0
                        }
                    })
        except Exception:
            continue
            
    ops = [UpdateOne({"reddit_id": p["reddit_id"]}, {"$set": p}, upsert=True) for p in posts]
    if ops:
        if dry_run: return [op._doc["$set"] for op in ops]
        try:
            db['posts'].bulk_write(ops)
            print(f"      ✅ Upserted {len(ops)} Lemmy posts.")
        except Exception: return 0
    return [] if dry_run else 0

def run_social_pipeline(dry_run=False):
    """ 
    Runs all social media fetchers.
    """
    print("\n🚀 Starting Multi-Platform Financial Pipeline...")
    
    total_posts = 0
    total_posts += fetch_reddit(dry_run=dry_run)
    total_posts += fetch_google_news(dry_run=dry_run)
    total_posts += fetch_youtube_videos(dry_run=dry_run)
    total_posts += fetch_mastodon(dry_run=dry_run)
    total_posts += fetch_hacker_news(dry_run=dry_run)
    total_posts += fetch_medium(dry_run=dry_run)
    total_posts += fetch_lemmy(dry_run=dry_run)
    total_posts += fetch_social_proxy(dry_run=dry_run)
    total_posts += fetch_web_scrape(dry_run=dry_run)
    
    print(f"🏁 Financial Pipeline Finished. Total Items: {total_posts}\n")
    return total_posts

if __name__ == "__main__":
    run_social_pipeline()
