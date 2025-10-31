import streamlit as st
import base64
from pathlib import Path

@st.cache_data
def img_to_base64(image_path):
    """
    Converts a local image file to a Base64 data URI.
    This allows embedding the image directly into the HTML 'src' attribute.
    """
    try:
        img_file = Path(image_path)
        if not img_file.exists():
            st.error(f"Image not found at path: {image_path}")
            return None
            
        with open(image_path, "rb") as f:
            data = f.read()
        
        file_extension = Path(image_path).suffix.lower()
        if file_extension in [".jpg", ".jpeg"]:
            mime_type = "image/jpeg"
        elif file_extension == ".png":
            mime_type = "image/png"
        else:
            mime_type = "image/png"
            
        b64_data = base64.b64encode(data).decode("utf-8")
        return f"data:{mime_type};base64,{b64_data}"
        
    except Exception as e:
        st.error(f"Error converting image {image_path}: {e}")
        return None

# --- 1. Page Configuration ---
st.set_page_config(
    page_title="Lior Zafrir",
    layout="wide"
)

# --- 2. Custom CSS ---
st.markdown("""
<style>
    .project-card {
        display: block;
        border-radius: 10px;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        overflow: hidden;
    }
    .project-card:hover {
        transform: scale(1.03);
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.3);
    }
    .project-card img {
        width: 100%;
        height: 220px;
        object-fit: cover;
    }
</style>
""", unsafe_allow_html=True)

# --- 3. About Me Section ---
st.title("Lior Zafrir")
st.header("About Me")

about_me_text = """
Final-year Biomedical Engineering student at Tel Aviv University with hands-on
experience in medical device development, signal processing, and product design.
Passionate about bridging engineering innovation and clinical needs. Demonstrated
analytical and leadership skills through leading a multidisciplinary medical device
project at Beilinson.
"""
st.markdown(about_me_text)
st.write("---")

# --- 4. Projects Section ---
st.header("My Projects")

projects = [
    {
        "title": "Portfolio Manager",
        "description": "An intelligent platform for investment portfolio management with advanced analytics.",
        "url": "https://liostocks.streamlit.app/",
        "image_path": "images/liostocks.png"
    },
    {
        "title": "SmartTriage - AI Agent Project Gantt",
        "description": "A Gantt chart for managing a final project about an AI agent in a medical triage.",
        "url": "https://smartriagegantt.streamlit.app/",
        "image_path": "images/smartriage.png"
    },
    {
        "title": "Fourier Optics Simulator",
        "description": "An interactive web app simulating a 4f optical system to visualize how spatial filters in the Fourier plane perform image processing like edge detection and blurring.",
        "url": "https://fourieropticssimulator.streamlit.app/",
        "image_path": "images/fourieropticssimulator.png"
    },
    {
        "title": "Glucose-Insulin Minimal Model Simulator",
        "description": "An interactive app that solves a system of Ordinary Differential Equations (ODEs) to simulate the physiological dynamics of glucose and insulin.",
        "url": "https://physiosimulator.streamlit.app/",
        "image_path": "images/physiosimulator.png"
    },
    {
        "title": "Gait Analysis",
        "description": "A video-based gait analyzer that uses AI pose estimation to extract and plot biomechanical signals like knee angles..",
        "url": "https://gaitanalysis3.streamlit.app/",
        "image_path": "images/gaitanalysis3.png"
    },
    {
        "title": "ECG Arrhythmia Simulator",
        "description": "An interactive tool for simulating and visualizing common cardiac arrhythmias like AFib, PVCs, and Tachycardia.",
        "url": "https://ecgarrhythmiasimulator.streamlit.app/",
        "image_path": "images/ecgarrhythmiasimulator.png"
    }
]

# --- Display projects (2 per row) ---
for i in range(0, len(projects), 2):
    cols = st.columns(2)
    for j, col in enumerate(cols):
        if i + j < len(projects):
            project = projects[i + j]
            with col:
                st.subheader(project["title"])
                st.write(project["description"])
                image_base64_data = img_to_base64(project["image_path"])
                if image_base64_data:
                    image_link_html = f"""
                        <a href="{project['url']}" target="_blank" title="Click to visit project" class="project-card">
                            <img src="{image_base64_data}" alt="{project['title']}">
                        </a>
                    """                    
                    st.markdown(image_link_html, unsafe_allow_html=True)
    st.write("")
    st.write("")
    
