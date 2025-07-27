import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import SummarizeButton from "../SummarizeButton";
import TranslateButton from "../TranslateButton";

describe("Component Integration Tests", () => {
  afterEach(() => {
    cleanup();
  });

  test("TranslateButton and SummarizeButton render correctly", () => {
    const { container } = render(
      <>
        <TranslateButton onClick={() => {}} />
        <SummarizeButton onClick={() => {}} />
      </>,
    );

    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(2);

    const translateButton = Array.from(buttons).find(
      (btn) => btn.textContent === "翻訳する",
    );
    const summarizeButton = Array.from(buttons).find(
      (btn) => btn.textContent === "要約する",
    );

    expect(translateButton).toBeTruthy();
    expect(summarizeButton).toBeTruthy();
    expect(translateButton?.className).toContain("translate-btn");
    expect(summarizeButton?.className).toContain("summarize-btn");
  });
});
