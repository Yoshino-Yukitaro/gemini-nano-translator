import { describe, test, expect, afterEach } from 'bun:test';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TranslateButton from '../TranslateButton';
import SummarizeButton from '../SummarizeButton';

describe('Component Integration Tests', () => {
  afterEach(() => {
    cleanup();
  });

  test('TranslateButton and SummarizeButton render correctly', () => {
    const { container } = render(
      <>
        <TranslateButton onClick={() => {}} />
        <SummarizeButton onClick={() => {}} />
      </>
    );
    
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    
    const translateButton = Array.from(buttons).find(btn => btn.textContent === '翻訳する');
    const summarizeButton = Array.from(buttons).find(btn => btn.textContent === '要約する');
    
    expect(translateButton).toBeTruthy();
    expect(summarizeButton).toBeTruthy();
    expect(translateButton?.className).toContain('translate-btn');
    expect(summarizeButton?.className).toContain('summarize-btn');
  });
});