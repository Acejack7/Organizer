from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)

# Konfiguracja Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    source_lang = data.get("source_lang")
    target_lang = data.get("target_lang")
    text = data.get("text")

    prompt = f"Translate the following text from {source_lang} to {target_lang}:\n\n{text}"

    try:
        response = model.generate_content(prompt)
        translated = response.text.strip()
        return jsonify({"translation": translated})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)