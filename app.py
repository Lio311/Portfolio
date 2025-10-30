import streamlit as st
import base64
from pathlib import Path

# --- פונקציית עזר לקידוד תמונה ל-Base64 ---
@st.cache_data
def img_to_base64(image_path):
    """Converts a local image file to a Base64 data URI"""
    try:
        img_file = Path(image_path)
        if not img_file.exists():
            st.error(f"Image not found at path: {image_path}")
            return None
            
        with open(image_path, "rb") as f:
            data = f.read()
        
        # קביעת סוג התמונה (MIME type) לפי הסיומת
        file_extension = Path(image_path).suffix.lower()
        if file_extension == ".jpg" or file_extension == ".jpeg":
            mime_type = "image/jpeg"
        elif file_extension == ".png":
            mime_type = "image/png" # <-- הקוד כבר תמך בזה
        else:
            # הגדר ברירת מחדל אם צריך
            mime_type = "image/png"
            
        b64_data = base64.b64encode(data).decode("utf-8")
        return f"data:{mime_type};base64,{b64_data}"
        
    except Exception as e:
        st.error(f"Error converting image {image_path}: {e}")
        return None

# --- הגדרת עמוד ---
st.set_page_config(
    page_title="My Portfolio",
    layout="wide"
)

# --- אזור התיאור האישי (באנגלית) ---
st.title("My Portfolio")
st.header("About Me")
about_me_text = """
Final-year Biomedical Engineering student at Tel Aviv University with hands-on
experience in medical device development, signal processing, and product design.
Passionate about bridging engineering innovation and clinical needs. Demonstrated
analytical and leadership skills through leading a multidisciplinary medical device
project at Beilinson.

I also have a strong passion for the capital market and for projects that incorporate AI technology.
"""
st.markdown(about_me_text)

st.write("---") # Separator line

# --- אזור הפרויקטים (באנגלית) ---
st.header("My Projects")

projects = [
    {
        "title": "LioStocks - AI Investment Manager",
        "description": "An intelligent platform for investment portfolio management with advanced analytics.",
        "url": "https://liostocks.streamlit.app/",
        # ---!!! עדכון סיומת הקובץ ל-PNG !!!---
        "image_path": "images/liostocks.png" 
    },
    {
        "title": "SmartTriage - AI Agent Project Gantt",
        "description": "A Gantt chart for managing a final project about an AI agent in a medical triage.",
        "url": "https://smartriage.streamlit.app/",
        # ---!!! עדכון סיומת הקובץ ל-PNG !!!---
        "image_path": "images/smartriage.png"
    }
]

cols = st.columns(len(projects))

for i, project in enumerate(projects):
    with cols[i]:
        st.subheader(project["title"])
        st.write(project["description"])
        
        # 1. ממיר את התמונה המקומית לטקסט Base64
        image_base64_data = img_to_base64(project["image_path"])
        
        if image_base64_data:
            # 2. יוצר HTML עם נתוני התמונה המוטבעים
            image_link_html = f"""
                <a href="{project['url']}" target="_blank" title="Click to visit project">
                    <img src="{image_base64_data}" 
                         alt="{project['title']}" 
                         style="width:100%; border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
                </a>
            """
            # 3. מציג את ה-HTML
            st.markdown(image_link_html, unsafe_allow_html=True)
