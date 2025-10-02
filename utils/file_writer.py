import os

def write_code_to_file(file_path, code):
    """
    Writes generated code to the given file path.
    Creates directories if they don't exist.
    """
    # Ensure directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Save code to file
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)

    print(f"[✅] Code saved to: {file_path}")
