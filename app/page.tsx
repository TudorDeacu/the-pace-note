export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#000",
      }}
    >
      <h1
        style={{
          color: "#fff",
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontSize: "clamp(2.5rem, 10vw, 8rem)",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          fontStyle: "italic",
          margin: 0,
        }}
      >
        ÎN CURÂND
      </h1>
    </main>
  );
}
