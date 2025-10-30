import streamlit as st
import requests
from bs4 import BeautifulSoup

# הגדרת עמוד - עכשיו באנגלית
st.set_page_config(
    page_title="My Portfolio",
    layout="wide"
)

# --- פונקציית עזר לשאיבת תמונות ---
# @st.cache_data מונע מהפונקציה לרוץ שוב ושוב בכל טעינה מחדש
@st.cache_data
def get_og_image(url, fallback_image):
    """
    Fetches the Open Graph (og:image) URL from a webpage.
    Returns fallback_image if not found or on error.
    """
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status() # Check for HTTP errors
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the <meta property="og:image" ...> tag
        meta_tag = soup.find("meta", property="og:image")
        
        if meta_tag and meta_tag.get('content'):
            return meta_tag['content'] # Return the image URL
        else:
            return fallback_image # No tag found, use fallback
            
    except requests.exceptions.RequestException as e:
        # On any error (timeout, connection error, etc.), use fallback
        print(f"Error fetching {url}: {e}")
        return fallback_image

# --- אזור התיאור האישי (באנגלית) ---

st.title("My Portfolio")
st.header("About Me")

# התיאור שלך
about_me_text = """
Final-year Biomedical Engineering student at Tel Aviv University with hands-on
experience in medical device development, signal processing, and product design.
Passionate about bridging engineering innovation and clinical needs. Demonstrated
analytical and leadership skills through leading a multidisciplinary medical device
project at Beilinson.

I also have a strong passion for the capital market and for projects that incorporate AI technology.
"""
st.markdown(about_me_text)

st.write("---") # קו מפריד

# --- אזור הפרויקטים (באנגלית) ---

st.header("My Projects")

# הגדרת הפרויקטים שלך
projects = [
    {
        # ---!!! תיאור מעודכן !!!---
        "title": "LioStocks - AI Investment Manager",
        "description": "An intelligent platform for investment portfolio management with advanced analytics.",
        "url": "https://liostocks.streamlit.app/",
        "fallback_image": "https://images.unsplash.com/photo-1611974783364-ec2f493b80b4?auto=format&fit=crop&q=80&w=870"
    },
    {
        # ---!!! תיאור מעודכן !!!---
        "title": "SmartTriage - AI Agent Project Gantt",
        "description": "A Gantt chart for managing a final project about an AI agent in a medical triage.",
        "url": "https://smartriage.streamlit.app/",
        "fallback_image": "https://images.unsplash.com/photo-1576091160550-2173ada99a6b?auto=format&fit=crop&q=80&w=870"
    }
]

# יצירת עמודות דינמיות לפי מספר הפרויקטים
cols = st.columns(len(projects))

for i, project in enumerate(projects):
    with cols[i]:
        st.subheader(project["title"])
        st.write(project["description"])
        
        # 1. שואב את התמונה מהקישור (או משתמש בגיבוי)
        image_url = get_og_image(project["url"], project["fallback_image"])
        
        # 2. יוצר HTML כדי להפוך את התמונה לקישור
        image_link_html = f"""
            <a href="{project['url']}" target="_blank" title="Click to visit project">
                <img src="{image_url}" 
                     alt="{project['title']}" 
                     style="width:100%; border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
            </a>
        """
        
        # 3. מציג את ה-HTML
        st.markdown(image_link_html, unsafe_allow_html=True)
