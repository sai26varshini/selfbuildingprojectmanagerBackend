import os
from dotenv import load_dotenv
from groq import Groq
from fpdf import FPDF

# Load environment variables (once)
load_dotenv()

# Initialize client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def _generate_research_paper_text(project_name: str, domain: str) -> str:
    """
    Internal function: generates the research paper content in Markdown text.
    """
    prompt = f"""
You are a research scientist and technical writer.

Write a detailed **research paper** for a project named "{project_name}" 
in the domain "{domain}".

The research paper should include:
- Abstract
- Introduction
- Literature Review
- Proposed Methodology
- Expected Results
- Conclusion
- References (real and relevant)

Format in clean markdown with headings and bullet points where necessary.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a professional research paper writer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
        max_tokens=2500
    )

    return response.choices[0].message.content.strip()


def generate_research_paper_pdf(project_name: str, domain: str, base_path: str):
    """
    Generates the research paper text and saves it as a PDF.
    Returns both the text and the PDF file path.
    """
    content = _generate_research_paper_text(project_name, domain)

    # Ensure directory exists
    os.makedirs(base_path, exist_ok=True)
    pdf_path = os.path.join(base_path, "RESEARCH_PAPER.pdf")

    # Create PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Add content line by line
    for line in content.split("\n"):
        pdf.multi_cell(0, 10, line)

    pdf.output(pdf_path)

    return content, pdf_path
