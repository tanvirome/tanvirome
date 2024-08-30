import re

def read_file(file_path):
  with open(file_path, 'r', encoding='utf8') as f:
    return f.read()

def write_file(file_path, content):
  with open(file_path, 'w', encoding='utf8') as f:
    f.write(content)

def replace_string_template(pattern, content, replaced_value):
	return re.sub(pattern, str(replaced_value), content)
