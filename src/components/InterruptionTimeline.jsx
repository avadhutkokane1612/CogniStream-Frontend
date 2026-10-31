const interruptionData = [
  {
    time: '09:00 AM',
    activity: 'Coding Started',
    source: 'IDE',
    duration: '45 min',
    type: 'coding',
  },
  {
    time: '09:45 AM',
    activity: 'Slack Notification',
    source: 'Slack',
    duration: '10 min',
    type: 'interruption',
  },
  {
    time: '09:55 AM',
    activity: 'Coding Resumed',
    source: 'IDE',
    duration: '35 min',
    type: 'coding',
  },
  {
    time: '10:30 AM',
    activity: 'GitHub Pull Request',
    source: 'GitHub',
    duration: '15 min',
    type: 'interruption',
  },
  {
    time: '10:45 AM',
    activity: 'Coding Resumed',
    source: 'IDE',
    duration: '50 min',
    type: 'coding',
  },
]

function InterruptionTimeline() {
  return (
    <article className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">WEEK 3 · FRICTION ANALYTICS</p>
          <h2>Coding Interruption Timeline</h2>
        </div>
        <span className="tag">Sample Data</span>
      </div>

      <div style={{ marginTop: '28px' }}>
        {interruptionData.map((item, index) => (
          <div
            key={index}
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
                background:
                  item.type === 'coding' ? '#16a36a' : '#e99b32',
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
                <strong>{item.activity}</strong>
                <span>{item.time}</span>
              </div>

              <p
                style={{
                  fontSize: '13px',
                  color: '#8490a5',
                  marginTop: '6px',
                }}
              >
                {item.source} · {item.duration}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="chart-note">
        Illustrative timeline events. Not connected to live telemetry.
      </p>
    </article>
  )
}

export default InterruptionTimeline