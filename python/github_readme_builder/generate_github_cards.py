import asyncio
import os
import re
import aiohttp

from constants import TPL_STR
from utils import replace_string_template

async def generate_github_stat_card(user_info) -> None:
  """
  Generate an SVG card with summary statistics
  """
  with open("./images/github_stat_card_template.svg", "r") as f:
    content = f.read()

  content = replace_string_template(TPL_STR.NAME, user_info['accountAge'], content)
  content = replace_string_template(TPL_STR.ACCOUNT_AGE, user_info['accountAge'], content)
  content = replace_string_template(TPL_STR.STARS, user_info['stars'], content)
  content = replace_string_template(TPL_STR.FORKS, user_info['stars'], content)
  content = replace_string_template(TPL_STR.CONTRIBUTIONS, user_info['stars'], content)
  content = replace_string_template(TPL_STR.LINES_CHANGED, user_info['stars'], content)
  content = replace_string_template(TPL_STR.VIEWS, user_info['stars'], content)
  content = replace_string_template(TPL_STR.REPOS, user_info['stars'], content)

  with open("./images/github_stat_card.svg", "w") as f:
    f.write(content)

  # content = re.sub("{{ stars }}", f"{await s.stargazers:,}", content)
  # content = re.sub("{{ forks }}", f"{await s.forks:,}", content)
  # content = re.sub("{{ contributions }}", f"{await s.total_contributions:,}",
  #                 content)
  # changed = (await s.lines_changed)[0] + (await s.lines_changed)[1]
  # content = re.sub("{{ lines_changed }}", f"{changed:,}", content)
  # content = re.sub("{{ views }}", f"{await s.views:,}", content)
  # content = re.sub("{{ repos }}", f"{len(await s.repos):,}", content)

async def generate_github_languages_card(user_info) -> None:
  """
  Generate an SVG card with summary statistics
  """
  with open("./images/github_languages_card_template.svg", "r") as f:
    content = f.read()

  content = replace_string_template(TPL_STR.NAME, user_info['accountAge'], content)
  content = replace_string_template(TPL_STR.ACCOUNT_AGE, user_info['accountAge'], content)
  content = replace_string_template(TPL_STR.STARS, user_info['stars'], content)
  content = replace_string_template(TPL_STR.FORKS, user_info['stars'], content)
  content = replace_string_template(TPL_STR.CONTRIBUTIONS, user_info['stars'], content)
  content = replace_string_template(TPL_STR.LINES_CHANGED, user_info['stars'], content)
  content = replace_string_template(TPL_STR.VIEWS, user_info['stars'], content)
  content = replace_string_template(TPL_STR.REPOS, user_info['stars'], content)

  # content = re.sub("{{ stars }}", f"{await s.stargazers:,}", content)
  # content = re.sub("{{ forks }}", f"{await s.forks:,}", content)
  # content = re.sub("{{ contributions }}", f"{await s.total_contributions:,}",
  #                 content)
  # changed = (await s.lines_changed)[0] + (await s.lines_changed)[1]
  # content = re.sub("{{ lines_changed }}", f"{changed:,}", content)
  # content = re.sub("{{ views }}", f"{await s.views:,}", content)
  # content = re.sub("{{ repos }}", f"{len(await s.repos):,}", content)

async def generate_github_cards(user_info) -> None:
  """
  Generate all cards
  """
