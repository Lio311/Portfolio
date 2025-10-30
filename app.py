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

#
# ---!!! עדכון: הוספתי את הפרויקטים שלך כאן !!!---
#

# הגדרת נתונים לפרויקטים
projects = [
    {
        "title": "LioStocks - ניתוח שוק ההון",
        "description": "פלטפורמה לניתוח מניות המשלבת טכנולוגיות AI.",
        "image": "https://images.unsplash.com/photo-1611974783364-ec2f493b80b4?auto=format&fit=crop&q=80&w=870", # תמונה בנושא שוק ההון
        "url": "https://liostocks.streamlit.app/"
    },
    {
        "title": "SmartTriage - טריאז' רפואי חכם",
        "description": "מערכת חכמה לסיווג וניהול פניות רפואיות (טריאז').",
        "image": "https://images.unsplash.com/photo-1576091160550-2173ada99a6b?auto=format&fit=crop&q=80&w=870", # תמונה בנושא טכנולוגיה רפואית
        "url": "https://smartriage.streamlit.app/"
    }
    # אתה יכול להוסיף עוד פרויקטים כאן באותו מבנה
    # {
    #     "title": "פרויקט עתידי",
    #     "description": "תיאור הפרויקט הבא שלך.",
    #     "image": "https"//... תמונה כלשהי",
    #     "url": "#" # קישור
    # },
]

# --- אפשרות א': שימוש בעמודות מובנות של Streamlit (פשוט ומומלץ) ---
# מחלק את העמוד לעמודות לפי מספר הפרויקטים
cols = st.columns(len(projects))

for i, project in enumerate(projects):
    with cols[i]:
        st.subheader(project["title"])
        # הקפד על use_column_width=True כדי שהתמונה תתאים לעמודה
        st.image(project["image"], use_column_width=True, caption=f"תצוגה מתוך {project['title']}")
        st.write(project["description"])
        # יצירת קישור מעוצב ככפתור (אופציונלי) או כטקסט
        # st.link_button("פתח את הפרויקט", project["url"]) # נראה טוב יותר
        st.markdown(f"**[פתח את הפרויקט]({project['url']})** 🔗")


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
