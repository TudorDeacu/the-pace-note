"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Arial Black', 'Arial Bold', Arial, sans-serif",
        padding: "2rem",
      }}
    >
      {/* Subtle radial glow behind content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(ellipse at center, rgba(233,72,47,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Thin top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "#E9482F",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
          position: "relative",
          zIndex: 1,
          maxWidth: "700px",
          width: "100%",
        }}
      >
        {/* Logo */}
        <div style={{ opacity: 0.95 }}>
          <Image
            src="/icon.png"
            alt="The Pace Note Logo"
            width={80}
            height={80}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Brand name */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#E9482F",
              fontSize: "clamp(0.65rem, 1.2vw, 0.8rem)",
              fontWeight: 900,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              margin: "0 0 1.2rem 0",
              fontFamily: "Arial, sans-serif",
            }}
          >
            The Pace Note
          </p>

          {/* Main headline */}
          <h1
            style={{
              color: "#E9482F",
              fontSize: "clamp(3.5rem, 14vw, 10rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              fontStyle: "italic",
              margin: 0,
              lineHeight: 0.9,
            }}
          >
            ÎN
            <br />
            CURÂND
          </h1>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "60px",
            height: "2px",
            background: "#E9482F",
            opacity: 0.5,
          }}
        />

        {/* Tagline */}
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "clamp(0.75rem, 1.5vw, 0.9rem)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textAlign: "center",
            margin: 0,
            fontFamily: "Arial, sans-serif",
            fontWeight: 400,
          }}
        >
          Orange Tainted Dreams
        </p>

        {/* Social Links */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
            marginTop: "0.5rem",
          }}
        >
          {[
            {
              label: "Instagram",
              href: "https://www.instagram.com/thepacenote/",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              ),
            },
            {
              label: "Facebook",
              href: "https://www.facebook.com/profile.php?id=61583479544402",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              ),
            },
            {
              label: "YouTube",
              href: "https://www.youtube.com/channel/UC1hSXkxGPGsaXFuNtKLIjvA",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#000"/>
                </svg>
              ),
            },
          ].map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              style={{
                color: "rgba(255,255,255,0.35)",
                transition: "color 0.2s ease, transform 0.2s ease",
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#E9482F";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom thin line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "#E9482F",
          opacity: 0.3,
        }}
      />

      {/* Copyright */}
      <p
        style={{
          position: "absolute",
          bottom: "20px",
          color: "rgba(255,255,255,0.15)",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontFamily: "Arial, sans-serif",
          margin: 0,
        }}
      >
        © {new Date().getFullYear()} The Pace Note
      </p>
    </main>
  );
}
