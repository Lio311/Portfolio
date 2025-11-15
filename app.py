import streamlit as st
import base64
from pathlib import Path

# --- 0. Utility Functions ---
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
    layout="wide",
    page_icon="💼"
)

# --- 2. Custom CSS ---
# Block 1: Meta tags and general style block setup
st.markdown("""
<style>
    <meta property="og:title" content="Lior Zafrir - Engineering Portfolio">
    <meta property="og:description" content="Explore my Streamlit portfolio featuring projects in signal processing, control systems, differential equation solutions, and biomedical signal analysis.">
    <meta property="og:image" content="https://example.com/preview.jpg">
    <meta property="og:url" content="https://my-portfolio.streamlit.app/">
    <meta name="twitter:card" content="summary_large_image">
</style>
""",
unsafe_allow_html=True
)

# Block 2: Project card specific CSS rules
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
        "description": "A comprehensive FinTech dashboard for algorithmic portfolio tracking, built entirely in Streamlit. The application integrates the yfinance API to fetch real-time market data, analyst recommendations, and fundamental financial metrics (P/E, Market Cap, etc.). It features a sophisticated data pipeline using Pandas that loads a personal portfolio from Excel, performs all performance calculations (P/L, %), and handles multi-currency FX conversions (USD/ILS). The UI leverages Plotly for dynamic, interactive charting and Streamlit Session State to create a responsive, multi-view dashboard.",
        "url": "https://liostocks.streamlit.app/",
        "image_path": "images/liostocks.png"
    },
    {
        "title": "Fourier Optics Simulator",
        "description": "An interactive Fourier Optics simulator built in Streamlit to demonstrate 2D Spatial Filtering concepts. This application models a 4f optical system, using NumPy to perform a 2D Fast Fourier Transform (FFT) on user-uploaded images (read via Pillow/OpenCV). This process projects the image into the frequency domain (Fourier plane). The user can then apply various computational masks (Low-Pass, High-Pass, Band-Pass) to directly manipulate the spatial frequencies. The final output is reconstructed via an Inverse FFT, visually demonstrating fundamental Image Processing techniques like real-time edge detection and blurring.",
        "url": "https://fourieropticssimulator.streamlit.app/",
        "image_path": "images/fourieropticssimulator.png"
    },
    {
        "title": "rPPG - Video-Based Vitals Analyzer",
        "description": "A real-time cardiovascular monitoring tool built in Streamlit. This app leverages Computer Vision (OpenCV, Haar Cascades) to perform facial detection, extracting a raw rPPG (remote Photoplethysmography) signal. It then employs a robust Digital Signal Processing (DSP) pipeline using SciPy and NumPy for digital filtering (Butterworth Bandpass), Frequency-Domain Analysis (FFT/PSD) to determine heart rate, and Time-Domain Analysis to calculate HRV (RMSSD). All vitals are visualized dynamically using Plotly.",
        "url": "https://rppgvitalsanalyzer.streamlit.app/",
        "image_path": "images/rppgvitalsanalyzer.png"
    },    
    {
        "title": "Gait Analysis",
        "description": "A Computer Vision-based biomechanics lab for kinematic gait analysis. This Streamlit application utilizes Google's MediaPipe AI framework for real-time, markerless pose estimation from video. The pipeline processes video with OpenCV, extracts 3D landmark coordinates, and uses NumPy for kinematic calculations (e.g., knee joint angles). The resulting biomechanical time-series signals are then visualized interactively using Plotly.",
        "url": "https://gaitanalysis3.streamlit.app/",
        "image_path": "images/gaitanalysis3.png"
    },
    {
        "title": "ECG Arrhythmia Simulator",
        "description": "An interactive cardiac electrophysiology simulator built with Streamlit. This tool leverages the NeuroKit2 library to generate high-fidelity, synthetic ECG waveforms, simulating a wide range of common arrhythmias (including AFib, PVCs, VT, and AV Blocks). The application provides dynamic parameter control and real-time Plotly visualization, serving as a powerful tool for arrhythmia analysis and education.",
        "url": "https://ecgarrhythmiasimulator.streamlit.app/",
        "image_path": "images/ecgarrhythmiasimulator.png"
    },
    {
        "title": "Glucose-Insulin Minimal Model Simulator",
        "description": "A Streamlit application for modeling complex gemological configurations. This app implements a procedural 2D rendering engine to compute and generate real-time vector sketches of a ring model. It utilizes the Python Imaging Library (Pillow) and its ImageDraw module to dynamically render complex geometries based on a set of discrete parameters. The platform allows for interactive modulation of key gemological and metallurgical variables (e.g., 9 stone shapes, metal type, Natural/Lab) and setting architecture (e.g., 'Seven-Stone' clusters, modular side-stone selection). A parallel, rule-based pricing model simulates the financial output (in ILS) by applying a matrix of multipliers based on the selected attributes.",
        "url": "https://ringsimulator.streamlit.app/",
        "image_path": "images/ringsimulator.png"
    },
    {
        "title": "Glucose-Insulin Minimal Model Simulator",
        "description": "A Systems Biology simulator for modeling complex physiological dynamics. This Streamlit app implements a mathematical model as a system of Ordinary Differential Equations (ODEs). It uses SciPy's (scipy.integrate.solve_ivp) numerical solvers to compute the time-series response of glucose and insulin. The platform allows for interactive modulation of key physiological parameters, with results rendered dynamically via Plotly.",
        "url": "https://physiosimulator.streamlit.app/",
        "image_path": "images/physiosimulator.png"
    },
    {
        "title": "AI Perfume Description Generator",
        "description": "An AI-powered content generator for automating SEO-optimized e-commerce descriptions. This Streamlit app implements a multi-step, generative AI pipeline. It uses the Google Custom Search API (googleapiclient.discovery) for dynamic URL discovery, BeautifulSoup (bs4) for web scraping, and the Google Gemini API (genai) in JSON mode for structured data extraction and creative content generation. The platform allows for interactive definition of products and SEO keywords, with the final, optimized copy rendered dynamically within the custom (RTL) Streamlit interface.",
        "url": "https://perfumegenerator.streamlit.app/",
        "image_path": "images/perfumegenerator.png"
    },
    {
        "title": "SmartTriage - AI Agent Project Gantt",
        "description": "A dynamic Project Management dashboard built with Streamlit to visualize complex project timelines. This tool features a robust data pipeline using Pandas to load, clean, and process task data directly from an Excel file. It automatically calculates task progress and generates an interactive, color-coded Gantt chart using Plotly Figure Factory. The app includes a custom-styled UI with CSS Injection for a tailored user experience and features dynamic date-range filtering (1W, 1M, 3M) managed via Streamlit Session State.",
        "url": "https://smartriagegantt.streamlit.app/",
        "image_path": "images/smartriage.png"
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
                
                # Use st.expander for a collapsible description
                with st.expander("View Description", expanded=False):
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
