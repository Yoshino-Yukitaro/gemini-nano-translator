import { describe, test, expect, mock, beforeAll, beforeEach, afterEach } from 'bun:test';
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import TranslatorPopup from '../TranslatorPopup';

// Gemini Nano APIのモック
beforeAll(() => {
  global.window = global.window || {};
  global.window.translation = {
    canTranslate: mock(() => Promise.resolve('readily' as TranslationAvailability)),
    createTranslator: mock(() => Promise.resolve({
      translate: mock((text: string) => Promise.resolve(`翻訳済み: ${text}`)),
      destroy: mock()
    }))
  };
  global.window.ai = {
    summarizer: {
      capabilities: mock(() => Promise.resolve({ available: 'readily' as const })),
      create: mock(() => Promise.resolve({
        summarize: mock((text: string) => Promise.resolve(`要約: ${text.substring(0, 20)}...`)),
        destroy: mock()
      }))
    }
  };
});

describe('TranslatorPopup', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render with selected text', () => {
    const { getByText } = render(
      <TranslatorPopup 
        selectedText="Hello world"
        onClose={() => {}}
      />
    );
    
    expect(getByText('Hello world')).toBeTruthy();
    expect(getByText('翻訳する')).toBeTruthy();
    expect(getByText('要約する')).toBeTruthy();
  });
  
  test('should show preview for long text', () => {
    const longText = 'This is a very long text that should be truncated in the preview section of the popup component';
    const { getByText } = render(
      <TranslatorPopup 
        selectedText={longText}
        onClose={() => {}}
      />
    );
    
    // 50文字以上のテキストは省略される
    expect(getByText(/^This is a very long text that should be truncated.../)).toBeTruthy();
  });
  
  test('should call onClose when close button is clicked', () => {
    const onCloseMock = mock();
    const { getByText } = render(
      <TranslatorPopup 
        selectedText="Hello world"
        onClose={onCloseMock}
      />
    );
    
    fireEvent.click(getByText('×'));
    
    expect(onCloseMock).toHaveBeenCalled();
  });
  
  test('should have correct structure', () => {
    const { container } = render(
      <TranslatorPopup 
        selectedText="Test text"
        onClose={() => {}}
      />
    );
    
    expect(container.querySelector('.gemini-translator-popup')).toBeTruthy();
    expect(container.querySelector('.popup-content')).toBeTruthy();
    expect(container.querySelector('.popup-header')).toBeTruthy();
    expect(container.querySelector('.selected-text-preview')).toBeTruthy();
    expect(container.querySelector('.button-container')).toBeTruthy();
  });

  test('should have action buttons with correct classes', () => {
    const { container } = render(
      <TranslatorPopup 
        selectedText="Test"
        onClose={() => {}}
      />
    );
    
    const translateButton = container.querySelector('.translate-btn');
    const summarizeButton = container.querySelector('.summarize-btn');
    
    expect(translateButton).toBeTruthy();
    expect(summarizeButton).toBeTruthy();
    expect(translateButton?.textContent).toBe('翻訳する');
    expect(summarizeButton?.textContent).toBe('要約する');
  });

  // Note: 非同期処理を含むテスト（翻訳・要約の実行、エラーハンドリング等）は
  // Bunのモックシステムの制限により、現在は正常に動作しません。
  // 実際の動作確認はChrome拡張機能として手動でテストしてください。
});