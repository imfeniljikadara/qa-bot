import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

async def ask_gemini(question: str) -> str:
    response = model.generate_content(question)
    return response.text.strip()