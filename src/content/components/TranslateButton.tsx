import type React from "react";

interface TranslateButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const TranslateButton: React.FC<TranslateButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <button
      type="button"
      className="action-btn translate-btn"
      onClick={onClick}
      disabled={disabled}
      title={
        disabled ? "翻訳機能は利用できません" : "選択したテキストを日本語に翻訳"
      }
    >
      翻訳する
    </button>
  );
};

export default TranslateButton;
