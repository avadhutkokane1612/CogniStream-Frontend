const switchData = [
{ from: 'IDE', to: 'Slack', count: 8 },
{ from: 'Slack', to: 'IDE', count: 6 },
{ from: 'IDE', to: 'GitHub', count: 5 },
{ from: 'GitHub', to: 'IDE', count: 4 },
{ from: 'Slack', to: 'GitHub', count: 3 },
]

function ContextSwitchChart() {
const maxCount = Math.max(...switchData.map((item) => item.count))

return ( <article className="panel context-switch-panel"> <div className="panel-heading"> <div> <p className="eyebrow">WEEK 3 · FRICTION ANALYTICS</p> <h2>Context Switching Analysis</h2> </div> <span className="tag">Sample Data</span> </div>

  <div style={{ display: 'grid', gap: '22px', marginTop: '28px' }}>
    {switchData.map((item, index) => (
      <div key={index}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '14px',
          }}
        >
          <span>{item.from} → {item.to}</span>
          <strong>{item.count}</strong>
        </div>

        <div
          style={{
            width: '100%',
            height: '12px',
            background: '#edf1f7',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(item.count / maxCount) * 100}%`,
              height: '100%',
              background: '#6878ed',
              borderRadius: '20px',
            }}
          />
        </div>
      </div>
    ))}
  </div>

  <p className="chart-note" style={{ marginTop: '24px' }}>
    Illustrative context-switching events. Not connected to live telemetry.
  </p>
</article>


)
}

export default ContextSwitchChart
