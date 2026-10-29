import App from "./App";
import { markets } from "./data";
import LandingPage from "./pages/landing/LandingPage";

interface SiteProps {
  pathname: string;
  search: string;
}

/** Normal links keep the landing page and demo console bookmarkable. */
export default function Site({ pathname, search }: SiteProps) {
  if (pathname !== "/app" && pathname !== "/app/") {
    return <LandingPage />;
  }

  const params = new URLSearchParams(search);
  const market = markets.find((item) => item.id === params.get("market"));
  const side = params.get("side");
  const auth = params.get("auth");
  const initialAction = auth === "signin" || auth === "signup"
    ? auth
    : params.get("create") === "1"
      ? "create"
      : market && (side === "yes" || side === "no")
        ? "wager"
        : undefined;

  return (
    <App
      initialPage={market ? "market-detail" : params.get("view") === "markets" ? "markets" : "overview"}
      initialMarketId={market?.id}
      initialOutcome={side === "no" ? "no" : "yes"}
      initialAction={initialAction}
    />
  );
}
