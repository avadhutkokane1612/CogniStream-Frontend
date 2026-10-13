import os
import requests
import pandas as pd

# Step 1: Ensure folder exists
os.makedirs("data/raw", exist_ok=True)

# Step 2: Define GitHub API endpoint (example public repo)
url = "https://api.github.com/repos/octocat/Hello-World/commits"

# Step 3: Fetch data
response = requests.get(url)
if response.status_code == 200:
    data = response.json()
else:
    print(f"Error fetching data: {response.status_code}")
    data = []

# Step 4: Convert JSON → DataFrame
if data:
    df = pd.json_normalize(data)

    # Step 5: Save to CSV
    output_path = "data/raw/github_commits.csv"
    df.to_csv(output_path, index=False)
    print(f"GitHub data extracted and saved successfully at {output_path}")
else:
    print("No data received from API.")
