export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀 BigShip Middleware</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>Your API is running successfully!</p>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "1rem",
            borderRadius: "8px",
            fontFamily: "monospace",
          }}
        >
          <p>Test your API:</p>
          <code>/api/tracking?tracking_id=9530643240010011&tracking_type=awb</code>
        </div>
      </div>
    </div>
  )
}
