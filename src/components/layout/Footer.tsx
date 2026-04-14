export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
        <p>SpaceX Explorer</p>
        <p>
          Data from{" "}
          <a
            href="https://github.com/r-spacex/SpaceX-API"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            r/SpaceX API
          </a>
        </p>
      </div>
    </footer>
  );
}
