import datetime

def write_to_readme(readme_content):
  with open("README.md", "w") as readme_file:
    readme_file.write(readme_content)

def generate_readme():
  readme_content = f"""
  # Hello, I'm Tanvir Ome! 👋

  Welcome to my GitHub profile! Here's a summary of my recent activity.

  ## Current Date and Time
  {datetime.datetime.now()}

  ## Other Information
  - 🔭 I’m currently working on: [Your Project](https://github.com/your-repo)
  - 🌱 I’m currently learning: Python, GitHub Actions
  - 💬 Ask me about: Anything
  """

  write_to_readme(readme_content)

if __name__ == "__main__":
  generate_readme()
