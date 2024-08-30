from github_api import get_user_info, get_total_commits, get_total_reviews
from template_processor import TPL_STR, replace_language_template, replace_string_template
from utils import read_file, write_file

def build_readme():
    token = 'your_github_token'
    template_path = 'template_path'
    readme_path = '../README.md'
    include_forks = True

    headers = {'Authorization': f'token {token}'}

    user_info = get_user_info(headers, include_forks)
    total_commits = get_total_commits(headers, user_info['contributionYears'])
    total_reviews = get_total_reviews(headers, user_info['contributionYears'])

    content = read_file(template_path)

    content = replace_language_template(content, user_info['repositoryNodes'])
    content = replace_string_template(content, TPL_STR.ACCOUNT_AGE, user_info['accountAge'])
    content = replace_string_template(content, TPL_STR.ISSUES, user_info['issues'])
    content = replace_string_template(content, TPL_STR.PULL_REQUESTS, user_info['pullRequests'])
    content = replace_string_template(content, TPL_STR.COMMITS, total_commits)
    content = replace_string_template(content, TPL_STR.CODE_REVIEWS, total_reviews)
    content = replace_string_template(content, TPL_STR.GISTS, user_info['gists'])
    content = replace_string_template(content, TPL_STR.REPOSITORIES, user_info['repositories'])
    content = replace_string_template(content, TPL_STR.REPOSITORIES_CONTRIBUTED_TO, user_info['repositoriesContributedTo'])
    content = replace_string_template(content, TPL_STR.STARS, user_info['stars'])

    write_file(readme_path, content)
