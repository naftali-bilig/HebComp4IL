export default function Home() {
  return (
    <main className="site-shell">
      <iframe
        className="jclock-frame"
        src="/jclock/index.html"
        title="קידוש החודש"
        allow="autoplay; geolocation"
      />
    </main>
  );
}
