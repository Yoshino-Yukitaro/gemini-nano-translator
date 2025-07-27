import { describe, test, expect, mock, afterEach } from 'bun:test';
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import TranslateButton from '../TranslateButton';

describe('TranslateButton', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render with correct text', () => {
    const { getByText } = render(
      <TranslateButton onClick={() => {}} />
    );
    
    expect(getByText('翻訳する')).toBeTruthy();
  });
  
  test('should call onClick when clicked', () => {
    const onClickMock = mock();
    const { getByText } = render(
      <TranslateButton onClick={onClickMock} />
    );
    
    fireEvent.click(getByText('翻訳する'));
    
    expect(onClickMock).toHaveBeenCalled();
  });
  
  test('should be disabled when disabled prop is true', () => {
    const { getByText } = render(
      <TranslateButton onClick={() => {}} disabled={true} />
    );
    
    const button = getByText('翻訳する') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
  
  test('should show correct title when disabled', () => {
    const { getByText } = render(
      <TranslateButton onClick={() => {}} disabled={true} />
    );
    
    const button = getByText('翻訳する') as HTMLButtonElement;
    expect(button.title).toBe('翻訳機能は利用できません');
  });
  
  test('should show correct title when enabled', () => {
    const { getByText } = render(
      <TranslateButton onClick={() => {}} disabled={false} />
    );
    
    const button = getByText('翻訳する') as HTMLButtonElement;
    expect(button.title).toBe('選択したテキストを日本語に翻訳');
  });
  
  test('should have correct CSS classes', () => {
    const { getByText } = render(
      <TranslateButton onClick={() => {}} />
    );
    
    const button = getByText('翻訳する') as HTMLButtonElement;
    expect(button.className).toContain('action-btn');
    expect(button.className).toContain('translate-btn');
  });
});