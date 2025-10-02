import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_code_for_file(file_path, domain, project_name):
    prompt = f"""
You are a senior software engineer.

Generate only raw code for the file `{file_path}` in a project named `{project_name}`.
The domain is: {domain}.
Provide realistic, working code assuming this is part of a modular application.
No placeholders, no explanation. Only valid code output.
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # ✅ Use a valid Groq model here
            messages=[
                {"role": "system", "content": "You are a helpful code generator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1200
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"[❌] Error generating code for {file_path}: {e}")
        return "// Error generating code"
