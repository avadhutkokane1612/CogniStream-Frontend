import { useEffect, useMemo, useState } from 'react'

import MetricCard from './components/MetricCard'
import ActivityCard from './components/ActivityCard'
import FocusChart from './components/FocusChart'
import ContextSwitchChart from './components/ContextSwitchChart'
import InterruptionTimeline from './components/InterruptionTimeline'

import metrics from './data/metrics.js'
import { activities } from './data/activityData.js'

import './App.css'

// --------------------------------------------------
// SAMPLE CHART DATA
// --------------------------------------------------

const chartValues = [42, 65, 50, 78, 58, 88, 70, 46, 74, 60, 83, 55]

const chartTimes = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
]

// --------------------------------------------------
// NAVIGATION
// --------------------------------------------------

const navigationItems = [
  { label: '▦ Overview', id: 'overview', filter: 'All' },
  { label: '◷ Flow State', id: 'flow-state', filter: 'All' },
  { label: 'GH GitHub Activity', id: 'github', filter: 'GitHub' },
  { label: 'SL Slack Activity', id: 'slack', filter: 'Slack' },
  { label: 'IDE IDE Activity', id: 'ide', filter: 'IDE' },
  { label: '☷ Activity Log', id: 'activity-log', filter: 'All' },
]

// --------------------------------------------------
// HELPER FUNCTION
// --------------------------------------------------

function formatCodingTime(minutes) {
  if (minutes === null || minutes === undefined) {
    return '—'
  }

  const totalMinutes = Math.round(Number(minutes))

  const hours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  return `${hours}h ${remainingMinutes}m`
}

function formatDateTime(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

// --------------------------------------------------
// MAIN APP
// --------------------------------------------------

function App() {
  const [filter, setFilter] = useState('All')
  const [activeNav, setActiveNav] = useState('overview')

  // API STATES
  const [apiEvents, setApiEvents] = useState([])
  const [apiError, setApiError] = useState('')
  const [apiConnected, setApiConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  const [apiSummary, setApiSummary] = useState(null)
  const [apiSessions, setApiSessions] = useState([])
  const [apiInterruptions, setApiInterruptions] = useState([])
  const [durationMetrics, setDurationMetrics] = useState(null)
  const [flowMetrics, setFlowMetrics] = useState(null)
  const [contextSwitchMetrics, setContextSwitchMetrics] = useState(null)

  // --------------------------------------------------
  // BACKEND API INTEGRATION
  // --------------------------------------------------

  useEffect(() => {
    const API_URL = 'http://127.0.0.1:8000'

    const fetchAPI = async (endpoint) => {
      const response = await fetch(`${API_URL}${endpoint}`)

      if (!response.ok) {
        throw new Error(`API request failed: ${endpoint}`)
      }

      return response.json()
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true)

        const [
          health,
          summary,
          sessions,
          interruptions,
          duration,
          flow,
          contextSwitching,

        ] = await Promise.all([
          fetchAPI('/api/health'),
          fetchAPI('/api/summary'),
          fetchAPI('/api/sessions'),
          fetchAPI('/api/interruptions'),
          fetchAPI('/api/metrics/duration'),
          fetchAPI('/api/metrics/flow'),
          fetchAPI('/api/metrics/context-switching'),
        ])

        // CONNECTION STATUS
        setApiConnected(health.status === 'healthy')

        // SUMMARY DATA
        setApiSummary(summary.summary || {})

        // CODING SESSIONS
        setApiSessions(sessions.data || [])

        // SLACK INTERRUPTIONS
        setApiInterruptions(interruptions.data || [])

        // DURATION METRICS
        setDurationMetrics(duration.duration_metrics || {})

        // FLOW METRICS
        setFlowMetrics(flow.flow_metrics || {})

       setContextSwitchMetrics(contextSwitching || {})

        // FORMAT INTERRUPTION EVENTS
        const formattedEvents = (interruptions.data || []).map((item) => ({
          time: formatDateTime(item.slack_timestamp),
          source: 'Slack',
          event: item.slack_message || 'Slack Interruption',
          category: 'Interruption',
        }))

        setApiEvents(formattedEvents)

        setApiError('')
      } catch (error) {
        console.error('Dashboard API Error:', error)

        setApiConnected(false)
        setApiError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  // --------------------------------------------------
  // FILTER ACTIVITY EVENTS
  // --------------------------------------------------

  const filteredEvents = useMemo(() => {
    if (filter === 'All') {
      return apiEvents
    }

    return apiEvents.filter(
      (event) => event.source === filter
    )
  }, [filter, apiEvents])

  // --------------------------------------------------
  // BACKEND KPI CARDS
  // --------------------------------------------------

  const frictionMetrics = [
    {
      title: 'Total Coding Time',
      value: formatCodingTime(apiSummary?.total_coding_minutes),
      note: 'Backend API data',
      icon: '⌨',
    },
    {
      title: 'Total Interruptions',
      value: apiSummary?.total_interruptions ?? '—',
      note: 'Backend API data',
      icon: '↯',
    },
    {
      title: 'Coding Sessions',
      value: apiSummary?.total_sessions ?? '—',
      note: 'Backend API data',
      icon: '⇄',
    },
    {
      title: 'Flow Sessions',
      value: apiSummary?.qualifying_sessions ?? flowMetrics?.qualifying_sessions ?? '—',
      note: 'Sessions meeting 90-minute criteria',
      icon: '◷',
    },
  ]

  // --------------------------------------------------
  // FOCUS CHART CONFIGURATION
  // --------------------------------------------------

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#172033',
      borderWidth: 0,
      textStyle: {
        color: '#ffffff',
      },
    },

    grid: {
      left: 12,
      right: 12,
      top: 25,
      bottom: 25,
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartTimes,

      axisLine: {
        lineStyle: {
          color: '#e5eaf2',
        },
      },

      axisTick: {
        show: false,
      },

      axisLabel: {
        color: '#8994a7',
      },
    },

    yAxis: {
      type: 'value',
      min: 0,
      max: 100,

      splitLine: {
        lineStyle: {
          color: '#edf1f7',
          type: 'dashed',
        },
      },

      axisLabel: {
        color: '#8994a7',
        formatter: '{value}%',
      },
    },

    series: [
      {
        name: 'Focus level',
        type: 'line',
        smooth: true,
        data: chartValues,
        symbol: 'circle',
        symbolSize: 6,

        lineStyle: {
          width: 3,
          color: '#6878ed',
        },

        itemStyle: {
          color: '#6878ed',
        },

        areaStyle: {
          color: 'rgba(104, 120, 237, 0.12)',
        },
      },
    ],
  }

  // --------------------------------------------------
  // NAVIGATION HANDLER
  // --------------------------------------------------

  const handleNavigation = (item) => {
    setActiveNav(item.id)
    setFilter(item.filter)
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <h2 className="brand">
          CogniStream<span>.</span>
        </h2>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="navigation" aria-label="Main navigation">

          {navigationItems.map((item) => (
            <a
              key={item.id}
              className={`nav-link ${
                activeNav === item.id ? 'active' : ''
              }`}
              href={`#${item.id}`}
              onClick={() => handleNavigation(item)}
            >
              {item.label}
            </a>
          ))}

        </nav>

        <div className="sidebar-footer">

          <span className="status-dot" />

          {loading
            ? 'Backend API · Connecting'
            : apiConnected
              ? 'Backend API · Connected'
              : 'Backend API · Disconnected'}

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content" id="overview">

        {/* HEADER */}

        <header className="topbar">

          <div>

            <p className="eyebrow">
              DEVELOPER ANALYTICS
            </p>

            <h1>
              Developer Flow Dashboard
            </h1>

            <p className="subtitle">
              Understand focus, interruptions and development activity.
            </p>

          </div>

          <span className="date-badge">
            WEEK 3 · API INTEGRATION
          </span>

        </header>

        {/* DATA NOTICE */}

        <div className="sample-banner" role="status">

          Simulated Data – For Testing & Demonstration.
          This dashboard uses synthetic sample data.

        </div>

        {/* API ERROR */}

        {apiError && (
          <div className="sample-banner" role="alert">
            Backend connection error: {apiError}
          </div>
        )}

        {/* EXISTING WEEK 2 METRICS */}

        <section
          className="metrics-grid"
          aria-label="Developer metrics"
        >

          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              metric={metric}
            />
          ))}

        </section>

        {/* DEVELOPER FRICTION OVERVIEW */}

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              WEEK 3 · FRICTION ANALYTICS
            </p>

            <h2>
              Developer Friction Overview
            </h2>

          </div>

          <span className="tag">
            Backend Metrics
          </span>

        </div>

        {/* API KPI CARDS */}

        <section
          className="metrics-grid"
          aria-label="Developer Friction metrics"
        >

          {frictionMetrics.map((metric) => (
            <MetricCard
              key={metric.title}
              metric={metric}
            />
          ))}

        </section>

        {/* SESSION AND FLOW DETAILS */}

        <section className="content-grid">

          <article className="panel">

            <div className="panel-heading">

              <div>

                <p className="eyebrow">
                  SESSION ANALYTICS
                </p>

                <h2>
                  Session Duration
                </h2>

              </div>

              <span className="tag">
                Backend API
              </span>

            </div>

            <p>
              Total Sessions: {durationMetrics?.total_sessions ?? 0}
            </p>

            <p>
              Average Duration: {
                durationMetrics?.average_duration_minutes != null
                  ? `${Number(durationMetrics.average_duration_minutes).toFixed(2)} min`
                  : '—'
              }
            </p>

            <p>
              Longest Session: {
                durationMetrics?.longest_session_minutes != null
                  ? `${Number(durationMetrics.longest_session_minutes).toFixed(2)} min`
                  : '—'
              }
            </p>

            <p>
              Shortest Session: {
                durationMetrics?.shortest_session_minutes != null
                  ? `${Number(durationMetrics.shortest_session_minutes).toFixed(2)} min`
                  : '—'
              }
            </p>

          </article>

          <article className="panel">

            <div className="panel-heading">

              <div>

                <p className="eyebrow">
                  FLOW ANALYTICS
                </p>

                <h2>
                  Flow State Summary
                </h2>

              </div>

              <span className="tag">
                Backend API
              </span>

            </div>

            <p>
              Total Sessions: {flowMetrics?.total_sessions ?? 0}
            </p>

            <p>
              Qualifying Sessions: {flowMetrics?.qualifying_sessions ?? 0}
            </p>

            <p>
              Non-Qualifying Sessions: {flowMetrics?.non_qualifying_sessions ?? 0}
            </p>

            <p>
              Flow Criteria: {flowMetrics?.flow_criteria_minutes ?? 90} minutes
            </p>

          </article>

        </section>

        {/* FLOW ANALYTICS */}

        <ContextSwitchChart metrics={contextSwitchMetrics} />

        <section style={{ marginTop: '24px' }}>
          <InterruptionTimeline interruptions={apiInterruptions} />
        </section>

        {/* FOCUS AND PRODUCTIVITY */}

        <section className="content-grid">

          <article className="panel" id="flow-state">

            <div className="panel-heading">

              <div>

                <p className="eyebrow">
                  FLOW ANALYTICS
                </p>

                <h2>
                  Focus Level Trend
                </h2>

              </div>

              <span className="tag">
                Simulated Chart
              </span>

            </div>

            <div className="chart-container">
              <FocusChart option={chartOption} />
            </div>

            <p className="chart-note">
              Illustrative focus scores across sample time intervals.
            </p>

          </article>

          {/* CONTEXT SWITCHING TAX */}

          <article className="panel tax-panel">

            <p className="eyebrow">
              PRODUCTIVITY INSIGHT
            </p>

            <h2>
              Context-Switching Tax
            </h2>

            <div className="insight-icon">
              ⇄
            </div>

            <p className="placeholder-text">
              This section will estimate focus time lost to interruptions
              when validated telemetry and calculation rules become available.
            </p>

            <span className="tag">
              Awaiting calculation rules
            </span>

          </article>

        </section>

        {/* DEVELOPER ACTIVITY */}

        <section
          className="activity-section"
          aria-label="Activity sources"
        >

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                CONNECTED SOURCES
              </p>

              <h2>
                Developer Activity
              </h2>

            </div>

            <span className="tag">
              3 source types
            </span>

          </div>

          <div className="activity-grid">

            {activities.map((activity) => {

              const name = activity.name.toLowerCase()

              const activityId = name.includes('github')
                ? 'github'
                : name.includes('slack')
                  ? 'slack'
                  : name.includes('ide')
                    ? 'ide'
                    : undefined

              return (
                <div
                  id={activityId}
                  className="activity-anchor"
                  key={activity.name}
                >

                  <ActivityCard activity={activity} />

                </div>
              )
            })}

          </div>

        </section>

        {/* RECENT ACTIVITY LOG */}

        <section
          className="panel table-panel"
          id="activity-log"
        >

          <div className="panel-heading table-heading">

            <div>

              <p className="eyebrow">
                EVENT MONITOR
              </p>

              <h2>
                Recent Activity Log
              </h2>

            </div>

            <label className="filter-control">

              <span>
                Filter source
              </span>

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >

                <option value="All">All</option>
                <option value="GitHub">GitHub</option>
                <option value="Slack">Slack</option>
                <option value="IDE">IDE</option>

              </select>

            </label>

          </div>

          <div className="table-scroll">

            <table>

              <thead>

                <tr>
                  <th>Time</th>
                  <th>Source</th>
                  <th>Event</th>
                  <th>Category</th>
                </tr>

              </thead>

              <tbody>

                {filteredEvents.map((event, index) => (

                  <tr
                    key={`${event.time}-${event.source}-${index}`}
                  >

                    <td>{event.time}</td>

                    <td>

                      <span
                        className={`source-pill ${event.source.toLowerCase()}`}
                      >
                        {event.source}
                      </span>

                    </td>

                    <td>{event.event}</td>

                    <td>{event.category}</td>

                  </tr>

                ))}

                {filteredEvents.length === 0 && (

                  <tr>

                    <td colSpan={4}>

                      {loading
                        ? 'Loading activity records...'
                        : apiError
                          ? 'Unable to load activity records.'
                          : 'No interruption records found in the database.'}

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          <p className="chart-note">
            Slack interruption records loaded from Backend API.
          </p>

        </section>

        {/* SESSION RECORD COUNT */}

        <section className="panel" style={{ marginTop: '24px' }}>

          <p className="eyebrow">
            DATABASE SUMMARY
          </p>

          <h2>
            Stored Coding Sessions
          </h2>

          <p>
            Records received from backend: {apiSessions.length}
          </p>

          <p>
            Slack interruptions received: {apiInterruptions.length}
          </p>

          <p>
            Average interruptions per session: {
              apiSummary?.average_interruptions_per_session ?? 0
            }
          </p>

        </section>

        {/* FOOTER */}

        <footer className="footer">

          CogniStream · Developer Friction Dashboard · Week 3

        </footer>

      </main>

    </div>
  )
}

export default App