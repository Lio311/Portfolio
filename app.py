import streamlit as st

# הגדרות עמוד בסיסיות
st.set_page_config(page_title="תיק עבודות", layout="wide")

# --- אזור התיאור האישי ---

st.title("תיק עבודות | Portfolio")
st.header("קצת עליי")

# התיאור שלך, כפי שביקשת
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

# --- אזור הפרויקטים (קלפים) ---

st.header("הפרויקטים שלי")

# הגדרת נתונים לפרויקטים
# החלף עם הפרויקטים האמיתיים שלך
# 'image' יכול להיות URL לתמונה או נתיב לקובץ מקומי
projects = [
    {
        "title": "פרויקט 1: ניתוח שוק המניות",
        "description": "תיאור קצר של הפרויקט. לדוגמה: מודל AI לחיזוי מגמות בשוק ההון.",
        "image": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fHN0b2Nrc3xlbnwwfHx8fDE2NzQwNDA0Mjk&ixlib=rb-4.0.3&q=80&w=400",
        "url": "https://github.com/your-username/project-1" # החלף בקישור שלך
    },
    {
        "title": "פרויקט 2: אבחון רפואי חכם",
        "description": "תיאור קצר של הפרויקט. לדוגמה: אפליקציית Streamlit המשתמשת ב-AI לאבחון.",
        "image": "https://images.unsplash.com/photo-1579684385127-6831d7e26e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxtZWRpY2FsJTIwYWl8ZW58MHx8fHwxNjc0MDQwNDc0&ixlib=rb-4.0.3&q=80&w=400",
        "url": "https://github.com/your-username/project-2" # החלף בקישור שלך
    },
    {
        "title": "פרויקט 3: מכשור רפואי",
        "description": "תיאור קצר של הפרויקט. לדוגמה: פרויקט הגמר שלי בפיתוח מכשיר רפואי.",
        "image": "https://images.unsplash.com/photo-1581093433567-9601031c06cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDExfHxiaW9tZWRpY2FsJTIwZW5naW5lZXJpbmd8ZW58MHx8fHwxNjc0MDQwNTEy&ixlib=rb-4.0.3&q=80&w=400",
        "url": "https://github.com/your-username/project-3" # החלף בקישור שלך
    }
]

# --- אפשרות א': שימוש בעמודות מובנות של Streamlit (פשוט יותר) ---
# מחלק את העמוד לעמודות לפי מספר הפרויקטים
cols = st.columns(len(projects))

for i, project in enumerate(projects):
    with cols[i]:
        st.subheader(project["title"])
        st.image(project["image"], use_column_width=True, caption=f"תמונה עבור {project['title']}")
        st.write(project["description"])
        st.markdown(f"**[לצפייה בפרויקט]({project['url']})** 🔗")


# --- אפשרות ב': שימוש ב-streamlit-card (דורש התקנה, עיצוב יפה יותר) ---
# הערה: אם תשתמש באפשרות זו, מחק או הפוך להערה את "אפשרות א'" שלמעלה
# from streamlit_card import card

# # הגדרת עמודות (לדוגמה, 2 פרויקטים בשורה)
# num_cols = 2
# cols = st.columns(num_cols)
# col_index = 0

# for project in projects:
#     with cols[col_index % num_cols]:
#         card(
#             title=project["title"],
#             text=project["description"],
#             image=project["image"],
#             url=project["url"],
#             styles={
#                 "card": {
#                     "width": "100%", # הכרטיס יתפוס את כל רוחב העמודה
#                     "margin": "10px",
#                     "border-radius": "10px",
#                     "box-shadow": "0 4px 8px 0 rgba(0,0,0,0.2)"
#                 },
#                 "image": {
#                     "object-fit": "cover", # גורם לתמונה למלא את האזור
#                     "height": "200px" # גובה אחיד לתמונה
#                 }
#             }
#         )
#     col_index += 1
