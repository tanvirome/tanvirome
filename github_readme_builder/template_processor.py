import re

class TPL_STR:
	LANGUAGE_TEMPLATE_START = 'LANGUAGE_TEMPLATE_START'
	LANGUAGE_TEMPLATE_END = 'LANGUAGE_TEMPLATE_END'
	LANGUAGE_NAME = 'LANGUAGE_NAME'
	LANGUAGE_PERCENT = 'LANGUAGE_PERCENT'
	LANGUAGE_COLOR = 'LANGUAGE_COLOR'
	ACCOUNT_AGE = 'ACCOUNT_AGE'
	ISSUES = 'ISSUES'
	PULL_REQUESTS = 'PULL_REQUESTS'
	CODE_REVIEWS = 'CODE_REVIEWS'
	COMMITS = 'COMMITS'
	GISTS = 'GISTS'
	REPOSITORIES = 'REPOSITORIES'
	REPOSITORIES_CONTRIBUTED_TO = 'REPOSITORIES_CONTRIBUTED_TO'
	STARS = 'STARS'


def replace_string_template(input_str, name, value):
	pattern = build_regex(name)
	return re.sub(pattern, str(value), input_str)


def replace_language_template(input_str, repositories):
	r_start = build_regex(TPL_STR.LANGUAGE_TEMPLATE_START, True)
	r_end = build_regex(TPL_STR.LANGUAGE_TEMPLATE_END, True)

	replacements = []
	for match in re.finditer(r_start, input_str):
		opts = match.group('opts')
		max_langs = int(get_opts_map(opts).get('max', 8)) if opts else 8

		start_idx = match.end()
		end_match = re.search(r_end, input_str[start_idx:])
		if end_match is None:
			continue

		end_idx = start_idx + end_match.start()
		template_str = input_str[start_idx:end_idx]

		replacement = ''.join(
			replace_string_template(
				replace_string_template(
					replace_string_template(
						template_str, TPL_STR.LANGUAGE_NAME, lang['name']),
					TPL_STR.LANGUAGE_PERCENT, lang['percent']
				),
				TPL_STR.LANGUAGE_COLOR, lang['color']
			)
			for lang in get_languages(repositories, max_langs)
		)

		replacements.append(
			{'start': start_idx, 'end': end_idx, 'replacement': replacement})

	output = input_str
	for replacement in replacements:
		output = output[:replacement['start']] + \
			replacement['replacement'] + output[replacement['end']:]
	output = re.sub(r_start, '', output)
	output = re.sub(r_end, '', output)
	return output


def get_languages(repositories, max_langs):
	languages = {}
	for repo in repositories:
		for lang in repo['languages']['edges']:
			if lang['node']['name'] in languages:
				languages[lang['node']['name']]['size'] += lang['size']
			else:
				languages[lang['node']['name']] = {
						'name': lang['node']['name'],
						'size': lang['size'],
						'percent': 0,
						'color': lang['node'].get('color', '#ededed')
				}

	langs = sorted(languages.values(), key=lambda l: l['size'], reverse=True)
	total_size = sum(lang['size'] for lang in langs)

	for lang in langs:
		lang['percent'] = round((lang['size'] / total_size) * 100, 1)

	if max_langs < len(langs):
		other_size = sum(lang['size'] for lang in langs[max_langs-1:])
		langs = langs[:max_langs-1] + [{
			'name': 'Other',
			'size': other_size,
			'percent': round((other_size / total_size) * 100, 1),
			'color': '#ededed'
		}]

	return langs


def build_regex(name, new_line=False):
	pattern = rf'\{{\{{\s*{name}(?::(?P<opts>.+?))?\s*\}}\}}'
	if new_line:
		pattern += '\n?'
	return pattern


def get_opts_map(opts_str):
	opts = {}
	for match in re.finditer(r'(?P<key>[^=;]+)(?:=(?P<value>[^;]+))?', opts_str):
		key = match.group('key')
		value = match.group('value')
		opts[key] = value
	return opts
