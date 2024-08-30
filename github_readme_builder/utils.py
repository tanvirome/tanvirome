def read_file(file_path):
  with open(file_path, 'r', encoding='utf8') as f:
    return f.read()

def write_file(file_path, content):
  with open(file_path, 'w', encoding='utf8') as f:
    f.write(content)
