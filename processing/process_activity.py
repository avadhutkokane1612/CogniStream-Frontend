import polars as pl
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

github = pl.read_csv(BASE_DIR / "data/raw/github_commits.csv")
slack = pl.read_csv(BASE_DIR / "data/raw/slack_data.csv")
ide = pl.read_csv(BASE_DIR / "Data/Raw/ide_activity.csv")

# GitHub common structure
github_data = github.select(
    pl.col("sha").alias("event_id"),
    pl.col("commit.message").alias("activity"),
).with_columns(
    pl.lit("GitHub").alias("source")
)

# Slack common structure
slack_data = slack.select(
    pl.col("id").cast(pl.String).alias("event_id"),
    pl.col("title").alias("activity"),
).with_columns(
    pl.lit("Slack").alias("source")
)

# IDE common structure
ide_data = ide.select(
    pl.col("id").cast(pl.String).alias("event_id"),
    pl.col("title").alias("activity"),
).with_columns(
    pl.lit("IDE").alias("source")
)

# Combine all sources
combined = pl.concat(
    [github_data, slack_data, ide_data]
)

print("\n===== COMBINED ACTIVITY DATA =====")
print("Total Events:", combined.height)
print(combined.group_by("source").len())
print(combined.head(10))
# Source-wise activity analytics
source_summary = (
    combined
    .group_by("source")
    .agg(
        pl.col("event_id").count().alias("total_events")
    )
    .sort("total_events", descending=True)
)

print("\n===== SOURCE-WISE ANALYTICS =====")
print(source_summary)

print("\n===== TOTAL EVENTS =====")
print(combined.height)
# Save processed data
output_dir = BASE_DIR / "data" / "processed"
output_dir.mkdir(parents=True, exist_ok=True)

output_file = output_dir / "combined_activity.csv"

combined.write_csv(output_file)

print("\n===== DATA EXPORTED SUCCESSFULLY =====")
print("Saved at:", output_file)