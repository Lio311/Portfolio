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
            
        # Read the image file in binary mode
        with open(image_path, "rb") as f:
            data = f.read()
        
        # Determine the MIME type (e.g., 'image/png') based on the file extension
        file_extension = Path(image_path).suffix.lower()
        if file_extension == ".jpg" or file_extension == ".jpeg":
            mime_type = "image/jpeg"
        elif file_extension == ".png":
            mime_type = "image/png"
        else:
            # Default to png if type is unknown
            mime_type = "image/png"
            
        # Encode the binary data to a Base64 string
        b64_data = base64.b64encode(data).decode("utf-8")
        
        # Format as a Base64 data URI
        return f"data:{mime_type};base64,{b64_data}"
        
    except Exception as e:
        st.error(f"Error converting image {image_path}: {e}")
        return None

# --- 1. Page Configuration ---
# Set the page title and layout
st.set_page_config(
    page_title="Lior Zafrir",
    layout="wide"
)

# --- 2. Custom CSS Injection ---
# Defines the styles for project cards, images, and hover effects.
st.markdown("""
<style>
    /* Styles the project card (the link wrapper) */
    .project-card {
        display: block;
        border-radius: 10px;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        overflow: hidden; /* Clips the image to the card's rounded corners */
    }

    /* Defines the hover effect for the card */
    .project-card:hover {
        transform: scale(1.03); /* Enlarge the card by 3% */
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.3); /* Darken the shadow */
    }

    /* Styles the image within the card */
    .project-card img {
        width: 100%;
        height: 220px;       /* Sets a fixed height for all images */
        object-fit: cover; /* Ensures the image fills the space without distortion */
    }
</style>
""", unsafe_allow_html=True)

# --- 3. About Me Section ---
st.title("Lior Zafrir")
st.header("About Me")

# Personal description text
about_me_text = """
Final-year Biomedical Engineering student at Tel Aviv University with hands-on
experience in medical device development, signal processing, and product design.
Passionate about bridging engineering innovation and clinical needs. Demonstrated
analytical and leadership skills through leading a multidisciplinary medical device
project at Beilinson.
"""
st.markdown(about_me_text)

st.write("---") # Separator line

# --- 4. Projects Section ---
st.header("My Projects")

# A list of dictionaries, each defining a project
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
    }
    {
        "title": "ECG Arrhythmia Simulator",
        "description": "An interactive tool for simulating and visualizing common cardiac arrhythmias like AFib, PVCs, and Tachycardia.",
        "url": "https://ecgarrhythmiasimulator.streamlit.app/",
        "image_path": "images/ecgarrhythmiasimulator.png"
    }
]
# Create a layout with a column for each project
cols = st.columns(len(projects))

# Loop through each project and render it in its column
for i, project in enumerate(projects):
    with cols[i]:
        st.subheader(project["title"])
        st.write(project["description"])
        
        # Convert the local image file to a Base64 string
        image_base64_data = img_to_base64(project["image_path"])
        
        # Only render the card if the image was successfully converted
        if image_base64_data:
            
            # Generate the HTML for the clickable image card
            image_link_html = f"""
                <a href="{project['url']}" target="_blank" title="Click to visit project" class="project-card">
                    <img src="{image_base64_data}" alt="{project['title']}">
                </a>
            """
            
            # Render the HTML in Streamlit
            st.markdown(image_link_html, unsafe_allow_html=True)
