def get_default_structure(project_name):
    return {
        project_name: {
            "agent": {
                "code_generator.py": "",
                "github_suggester.py": "",
                "groq_llm.py": "",
                "project_generator.py": "",
                "tool_fetcher.py": ""
            },
            "generated_projects": {
                "_ai_health_monitor": {
                    "main.py": "",
                    "README.md": "",
                    "requirements.txt": ""
                }
            },
            "tests": {
                "test_code_generator.py": "",
                "test_github_suggester.py": "",
                "test_tool_fetcher.py": ""
            },
            "utils": {
                "file_writer.py": "",
                "logger.py": "",
                "prompt_templates.py": ""
            },
            ".env": "",
            "main.py": "",
            "README.md": "",
            "requirements.txt": ""
        }
    }
