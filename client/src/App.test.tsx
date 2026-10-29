import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import App from "./App";

test("renders the prediction-market operations console", () => {
  const html = renderToStaticMarkup(<App />);

  expect(html).toContain("Prediction Markets");
  expect(html).toContain("Market activity");
  expect(html).toContain("Create market");
  expect(html).toContain("Add demo funds");
  expect(html).toContain("Sign in");
});

test("renders an isolated compact rail when the sidebar is collapsed", () => {
  const html = renderToStaticMarkup(<App initialSidebarCollapsed />);

  expect(html).toContain("sidebar-collapsed");
  expect(html).toContain("workspace workspace-expanded");
  expect(html).toContain("Expand sidebar");
});
