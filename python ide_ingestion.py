import os
import requests
import pandas as pd

# Ensure folder exists
os.makedirs("Data/Raw", exist_ok=True)

# Mock IDE Activity API endpoint (replace with actual mock URL later)
url = "https://jsonplaceholder.typicode.com/todos"

# Fetch data
response = requests.get(url)
if response.status_code == 200:
    data = response.json()
else:
    print(f"Error fetching data: {response.status_code}")
    data = []

# Convert JSON → DataFrame
if data:
    df = pd.json_normalize(data)

    # Save to CSV
    output_path = "Data/Raw/ide_activity.csv"
    df.to_csv(output_path, index=False)
    print(f"IDE activity data extracted and saved successfully at {output_path}")
else:
    print("No data received from API.")
