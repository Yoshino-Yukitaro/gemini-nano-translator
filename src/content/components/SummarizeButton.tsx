import React from 'react';

interface SummarizeButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const SummarizeButton: React.FC<SummarizeButtonProps> = ({ onClick, disabled }) => {
  return (
    <button 
      className="action-btn summarize-btn"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? '要約機能は利用できません' : '選択したテキストを日本語で要約'}
    >
      要約する
    </button>
  );
};

export default SummarizeButton;