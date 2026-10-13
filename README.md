# CogniStream: Developer Flow-State & Cognitive Load Analytics

## Problem Statement
Engineering productivity is often measured using flawed metrics like "lines of code written" or "tickets closed." These ignore the friction of the development process and fail to identify what blocks deep, focused work.  

CogniStream addresses this by analyzing developer flow state and cognitive load, highlighting interruptions such as poorly timed CI/CD alerts that reduce productivity.

## Use Case
An Engineering Manager can review the CogniStream dashboard to see a "Context-Switching Tax" analysis. Data shows how much focus time is lost due to interruptions, enabling managers to adjust notification policies and improve developer experience.

## Key Modules
- **Orchestration (Apache Airflow):** Scheduled DAGs pulling event logs from developer APIs (GitHub, Jira, Slack, VSCode Activity Watch).  
- **OLAP Database (ClickHouse):** Optimized for ingesting and querying massive volumes of timestamped event logs.  
- **Data Processing (Python & Polars):** High-speed data manipulation to calculate continuous "Flow State" blocks and identify interruption triggers.  
- **Custom Dashboard (React & Tremor.js):** Developer-centric frontend with polished analytics components.

## Development Plan
- **Week 1:** API ingestion (GitHub, Slack, IDE) + Airflow scheduling; UI scaffolding with React & Tremor.js.  
- **Week 2:** Data modeling in ClickHouse; base metrics in UI.  
- **Week 3:** Flow-state logic with SQL/Polars; friction UI charts.  
- **Week 4:** API layer with FastAPI; dashboard refinement and polish.

## Outcome
- A robust orchestration engine merging diverse event logs into a unified OLAP schema.  
- A specialized analytics UI measuring developer friction rather than just output.  

## Contributors
- Gitika (Team Leader)
- Rahul (Team Member)
- Avadhut (Team Member)
