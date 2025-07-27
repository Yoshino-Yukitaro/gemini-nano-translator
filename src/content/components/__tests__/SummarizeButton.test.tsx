import { describe, test, expect, mock, afterEach } from 'bun:test';
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import SummarizeButton from '../SummarizeButton';

describe('SummarizeButton', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render with correct text', () => {
    const { getByText } = render(
      <SummarizeButton onClick={() => {}} />
    );
    
    expect(getByText('要約する')).toBeTruthy();
  });
  
  test('should call onClick when clicked', () => {
    const onClickMock = mock();
    const { getByText } = render(
      <SummarizeButton onClick={onClickMock} />
    );
    
    fireEvent.click(getByText('要約する'));
    
    expect(onClickMock).toHaveBeenCalled();
  });
  
  test('should be disabled when disabled prop is true', () => {
    const { getByText } = render(
      <SummarizeButton onClick={() => {}} disabled={true} />
    );
    
    const button = getByText('要約する') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
  
  test('should show correct title when disabled', () => {
    const { getByText } = render(
      <SummarizeButton onClick={() => {}} disabled={true} />
    );
    
    const button = getByText('要約する') as HTMLButtonElement;
    expect(button.title).toBe('要約機能は利用できません');
  });
  
  test('should show correct title when enabled', () => {
    const { getByText } = render(
      <SummarizeButton onClick={() => {}} disabled={false} />
    );
    
    const button = getByText('要約する') as HTMLButtonElement;
    expect(button.title).toBe('選択したテキストを日本語で要約');
  });
  
  test('should have correct CSS classes', () => {
    const { getByText } = render(
      <SummarizeButton onClick={() => {}} />
    );
    
    const button = getByText('要約する') as HTMLButtonElement;
    expect(button.className).toContain('action-btn');
    expect(button.className).toContain('summarize-btn');
  });
});