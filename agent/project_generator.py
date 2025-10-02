import os
def create_project_structure(project_name, domain):
    base_path = os.path.join(os.getcwd(), project_name.replace(" ", "_"))
    os.makedirs(base_path, exist_ok=True)

    structure = {
        "main.py": "",
        "README.md": f"# {project_name}\n\nDomain: {domain}\n",
        "requirements.txt": "",
        "modules": {
            "__init__.py": "",
            "logic.py": "",
        },
        "utils": {
            "helpers.py": "",
        }
    }

    def create_files(base, struct):
        for name, content in struct.items():
            path = os.path.join(base, name)
            if isinstance(content, dict):
                os.makedirs(path, exist_ok=True)
                create_files(path, content)
            else:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)

    create_files(base_path, structure)

    # ✅ Print tree view
    print("\n[📂] Project structure created:\n")
    for root, dirs, files in os.walk(base_path):
        level = root.replace(base_path, "").count(os.sep)
        indent = " " * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        sub_indent = " " * 4 * (level + 1)
        for f in files:
            print(f"{sub_indent}{f}")

    return base_path
