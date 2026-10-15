import './App.css'

const metrics = [
  {
    title: 'Focus Time',
    value: '--',
    note: 'Awaiting validated data',
  },
  {
    title: 'Interruptions',
    value: '--',
    note: 'Awaiting event data',
  },
  {
    title: 'Context Switches',
    value: '--',
    note: 'Awaiting event data',
  },
  {
    title: 'Activity Sources',
    value: '3',
    note: 'GitHub · Slack · IDE',
  },
]

const activities = [
  {
    name: 'GitHub Activity',
    code: 'GH',
    description: 'Commits, pull requests, and repository events.',
    className: 'github',
  },
  {
    name: 'Slack Activity',
    code: 'SL',
    description: 'Communication events and potential interruptions.',
    className: 'slack',
  },
  {
    name: 'IDE Activity',
    code: 'IDE',
    description: 'Coding events and development activity.',
    className: 'ide',
  },
]

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">CogniStream<span>.</span></h2>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="navigation">
          <a className="nav-link active" href="#overview">▦ Overview</a>
          <a className="nav-link" href="#flow-state">◷ Flow State</a>
          <a className="nav-link" href="#github">⌘ GitHub Activity</a>
          <a className="nav-link" href="#slack">◉ Slack Activity</a>
          <a className="nav-link" href="#ide">⌨ IDE Activity</a>
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Frontend Preview
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div>
            <p className="eyebrow">DEVELOPER ANALYTICS</p>
            <h1>Developer Flow Dashboard</h1>
            <p className="subtitle">
              Understand focus, interruptions, and development activity.
            </p>
          </div>

          <span className="date-badge">WEEK 1 · UI PREVIEW</span>
        </header>

        <section className="metrics-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.title}>
              <p className="metric-label">{metric.title}</p>
              <h2>{metric.value}</h2>
              <p className="metric-note">{metric.note}</p>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel" id="flow-state">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">FLOW ANALYTICS</p>
                <h2>Focus &amp; Interruptions</h2>
              </div>
              <span className="tag">Preview</span>
            </div>

            <div className="chart-placeholder">
              <div className="chart-bars">
                {[38, 62, 48, 78, 55, 88, 65, 43, 72, 58, 82, 50].map(
                  (height, index) => (
                    <div
                      className="chart-bar"
                      key={index}
                      style={{ height: `${height}%` }}
                    />
                  ),
                )}
              </div>
              <p className="chart-note">
                Illustrative chart only — not actual developer data.
              </p>
            </div>
          </article>

          <article className="panel tax-panel">
            <p className="eyebrow">PRODUCTIVITY INSIGHT</p>
            <h2>Context-Switching Tax</h2>

            <div className="insight-icon">↔</div>

            <p className="placeholder-text">
              Estimate focus time lost to interruptions once event data and
              calculation rules are available.
            </p>

            <span className="tag">Awaiting data</span>
          </article>
        </section>

        <section className="activity-grid">
          {activities.map((activity) => (
            <article
              className="panel activity-card"
              id={activity.name === 'GitHub Activity' ? 'github' :
                activity.name === 'Slack Activity' ? 'slack' : 'ide'}
              key={activity.name}
            >
              <div className={`activity-icon ${activity.className}`}>
                {activity.code}
              </div>

              <div className="activity-info">
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
              </div>

              <span className="tag">Planned</span>
            </article>
          ))}
        </section>

        <footer className="footer">
          CogniStream · UI Scaffolding · Week 1
        </footer>
      </main>
    </div>
  )
}

export default App