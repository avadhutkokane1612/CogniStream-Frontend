function InterruptionTimeline({ interruptions = [] }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Time unavailable'

    const date = new Date(timestamp)

    if (Number.isNaN(date.getTime())) return timestamp

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <article className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">WEEK 3 · FRICTION ANALYTICS</p>
          <h2>Coding Interruption Timeline</h2>
        </div>

        <span className="tag">Database API</span>
      </div>

      {interruptions.length === 0 ? (
        <p className="chart-note" style={{ marginTop: '24px' }}>
          No interruption records available.
        </p>
      ) : (
        <div style={{ marginTop: '28px' }}>
          {interruptions.map((item) => (
            <div
              key={item.interruption_id}
              style={{
                display: 'flex',
                gap: '18px',
                marginBottom: '22px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  marginTop: '5px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: '#e99b32',
                }}
              />

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <strong>Slack Interruption</strong>
                  <span>{formatTime(item.slack_timestamp)}</span>
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    color: '#8490a5',
                    marginTop: '6px',
                  }}
                >
                  Slack · {item.slack_message || 'No message available'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="chart-note">
        Interruption records retrieved from the MySQL database through FastAPI.
      </p>
    </article>
  )
}

export default InterruptionTimeline