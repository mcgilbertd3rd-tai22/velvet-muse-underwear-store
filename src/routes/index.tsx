import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velvet Muse — Luxury Lingerie Marketplace" },
      { name: "description", content: "Velvet Muse — a luxury lingerie marketplace offering bras, panties and lingerie sets crafted for the modern woman." },
      { property: "og:title", content: "Velvet Muse — Luxury Lingerie" },
      { property: "og:description", content: "Discover luxury bras, panties and lingerie sets at Velvet Muse." },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/welcome.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff5f7", fontFamily: "serif", color: "#8b5a6b" }}>
      Loading Velvet Muse…
    </div>
  );
}
