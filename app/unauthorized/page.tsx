import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f8fafc",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "520px",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "24px",
          background: "#fff",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.5rem",
            color: "#0f172a",
          }}
        >
          Unauthorized
        </h1>
        <p style={{ marginTop: "8px", color: "#475569" }}>
          You don&apos;t have permission to view this page.
        </p>
        <div style={{ marginTop: "16px" }}>
          <Link href="/">Go back to home</Link>
        </div>
      </section>
    </main>
  );
}
