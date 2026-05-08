from flask import Flask, render_template, request, jsonify
from google import genai
import os
from dotenv import load_dotenv

# .env file load karo
load_dotenv()

app = Flask(__name__)

api_key = os.getenv("GOOGLE_GENAI_API_KEY")
if api_key:
    client = genai.Client(api_key=api_key)
else:
    print("Warning: GOOGLE_GENAI_API_KEY not found!")
    client = None
# ... rest of code same


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json["message"]

    try:
        if not client:
            bot_msg = "⚠️ API key missing. Set GOOGLE_GENAI_API_KEY."
            return jsonify({"reply": bot_msg})

        # Gemini model (free tier friendly)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_msg
        )
        bot_msg = response.text

    except Exception as e:
        bot_msg = "⚠️ AI service temporarily unavailable. Please try again later."

    return jsonify({"reply": bot_msg})

if __name__ == "__main__":
    app.run(debug=True)
