"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#faf8f5",
          color: "#141210",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 460, textAlign: "center" }}>
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 56,
              height: 56,
              margin: "0 auto",
              borderRadius: "50%",
              background: "rgba(191,69,20,0.12)",
              color: "#bf4514",
            }}
          >
            <AlertTriangle size={26} strokeWidth={1.6} />
          </span>

          <p
            style={{
              margin: "24px 0 0",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#7a746c",
            }}
          >
            Something went wrong
          </p>

          <h1 style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.03em", margin: "12px 0 0" }}>
            That one’s on us.
          </h1>

          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#6f6a64", marginTop: 12 }}>
            An unexpected error occurred while loading this page. Your bag is safe — try again
            and it should pick up where you left off.
          </p>

          {error.digest ? (
            <p style={{ fontSize: 12, color: "#a19b93", marginTop: 12 }}>
              Reference: {error.digest}
            </p>
          ) : null}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
            <button
              type="button"
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 48,
                padding: "0 26px",
                border: "none",
                borderRadius: 2,
                background: "#bf4514",
                color: "#fffdfb",
                fontSize: 11.5,
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              <RotateCw size={15} /> Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 48,
                padding: "0 26px",
                border: "1px solid #d6d0c6",
                borderRadius: 2,
                color: "#141210",
                fontSize: 11.5,
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={15} /> Back to shop
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
