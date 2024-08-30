import requests
import datetime


def get_user_info(headers, include_forks):
  query = f"""
  {{
    viewer {{
      createdAt
      issues {{ totalCount }}
      pullRequests {{ totalCount }}
      contributionsCollection {{ contributionYears }}
      gists(first: 100) {{
        totalCount
        nodes {{
          stargazers {{ totalCount }}
        }}
      }}
      repositories(affiliations: OWNER, isFork: {str(include_forks).lower()}, first: 100) {{
        totalCount
        nodes {{
          stargazers {{ totalCount }}
          languages(first: 100) {{
            edges {{
              size
              node {{
                color
                name
              }}
            }}
          }}
        }}
      }}
      repositoriesContributedTo {{ totalCount }}
    }}
  }}
  """

  url = "https://api.github.com/graphql"
  response = requests.post(url, json={"query": query}, headers=headers)
  response.raise_for_status()

  data = response.json()["data"]["viewer"]

  account_age_ms = (
    datetime.datetime.now().timestamp() * 1000
    - datetime.datetime.fromisoformat(data["createdAt"]).timestamp() * 1000
  )
  account_age = int(account_age_ms / (1000 * 60 * 60 * 24 * 365.25))

  stars = sum(
    gist["stargazers"]["totalCount"] for gist in data["gists"]["nodes"]
  ) + sum(repo["stargazers"]["totalCount"] for repo in data["repositories"]["nodes"])

  return {
    "accountAge": account_age,
    "issues": data["issues"]["totalCount"],
    "pullRequests": data["pullRequests"]["totalCount"],
    "contributionYears": data["contributionsCollection"]["contributionYears"],
    "gists": data["gists"]["totalCount"],
    "repositories": data["repositories"]["totalCount"],
    "repositoryNodes": data["repositories"]["nodes"],
    "repositoriesContributedTo": data["repositoriesContributedTo"]["totalCount"],
    "stars": stars,
  }


def get_total_commits(headers, contribution_years):
  queries = []
  for year in contribution_years:
    queries.append(
      f'_{year}: contributionsCollection(from: "{year}-01-01T00:00:00Z") {{ totalCommitContributions }}'
    )
  query = f'{{ viewer {{ {" ".join(queries)} }} }}'

  url = "https://api.github.com/graphql"
  response = requests.post(url, json={"query": query}, headers=headers)
  response.raise_for_status()

  data = response.json()["data"]["viewer"]
  return sum(data[year]["totalCommitContributions"] for year in data)


def get_total_reviews(headers, contribution_years):
  queries = []
  for year in contribution_years:
    queries.append(
      f'_{year}: contributionsCollection(from: "{year}-01-01T00:00:00Z") {{ totalPullRequestReviewContributions }}'
    )
  query = f'{{ viewer {{ {" ".join(queries)} }} }}'

  url = "https://api.github.com/graphql"
  response = requests.post(url, json={"query": query}, headers=headers)
  response.raise_for_status()

  data = response.json()["data"]["viewer"]

  return sum(data[year]["totalPullRequestReviewContributions"] for year in data)
