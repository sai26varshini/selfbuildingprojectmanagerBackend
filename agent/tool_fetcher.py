def fetch_tools(project_type: str) -> list:
    """
    Suggests tools or APIs based on the project type.
    """
    tools_by_type = {
        "Healthcare AI": ["TensorFlow", "Pandas", "FHIR API", "scikit-learn"],
        "Conversational AI": ["OpenAI API", "Rasa", "Hugging Face Transformers"],
        "Financial Analytics": ["Yahoo Finance API", "NumPy", "Matplotlib"],
        "Game Development": ["Unity", "Pygame", "Blender"],
        "Computer Vision": ["OpenCV", "YOLOv8", "TensorFlow", "LabelImg"],
        "Data Science": ["Pandas", "Jupyter", "Seaborn", "Matplotlib"],
        "General AI Project": ["OpenAI API", "scikit-learn", "LangChain"],
    }

    return tools_by_type.get(project_type, ["Python", "Requests", "Flask"])
