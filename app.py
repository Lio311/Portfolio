import streamlit as st
# אין צורך ב-requests וב-beautifulsoup4 יותר, כי אנחנו לא שואבים תמונות
# from bs4 import BeautifulSoup

# הגדרת עמוד
st.set_page_config(
    page_title="My Portfolio",
    layout="wide"
)

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
"""
st.markdown(about_me_text)

st.write("---") # Separator line

# --- אזור הפרויקטים (באנגלית) ---

st.header("My Projects")

# הגדרת הפרויקטים שלך - עכשיו עם נתיבים לתמונות מקומיות
projects = [
    {
        "title": "LioStocks - AI Investment Manager",
        "description": "An intelligent platform for investment portfolio management with advanced analytics.",
        "url": "https://liostocks.streamlit.app/",
        # ---!!! נתיב לתמונה מקומית !!!---
        "image_path": "images/liostocks.png" 
    },
    {
        "title": "SmartTriage - AI Agent Project Gantt",
        "description": "A Gantt chart for managing a final project about an AI agent in a medical triage.",
        "url": "https://smartriage.streamlit.app/",
        # ---!!! נתיב לתמונה מקומית !!!---
        "image_path": "images/smartriage.png"
    }
]

# יצירת עמודות דינמיות לפי מספר הפרויקטים
cols = st.columns(len(projects))

for i, project in enumerate(projects):
    with cols[i]:
        st.subheader(project["title"])
        st.write(project["description"])
        
        # 1. טעינת התמונה המקומית
        # Streamlit יודע לטפל בנתיבי קבצים מקומיים עבור תמונות
        image_local_path = project["image_path"]
        
        # 2. יוצר HTML כדי להפוך את התמונה לקישור
        image_link_html = f"""
            <a href="{project['url']}" target="_blank" title="Click to visit project">
                <img src="{image_local_path}" 
                     alt="{project['title']}" 
                     style="width:100%; border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
            </a>
        """
        
        # 3. מציג את ה-HTML
        st.markdown(image_link_html, unsafe_allow_html=True)
