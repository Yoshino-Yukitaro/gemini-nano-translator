import type React from "react";
import { useState } from "react";
import { useSummarizer } from "../hooks/useSummarizer";
import { useTranslator } from "../hooks/useTranslator";
import SummarizeButton from "./SummarizeButton";
import TranslateButton from "./TranslateButton";

interface TranslatorPopupProps {
  selectedText: string;
  onClose: () => void;
}

const TranslatorPopup: React.FC<TranslatorPopupProps> = ({
  selectedText,
  onClose,
}) => {
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    translate,
    isTranslatorAvailable,
    canDownload: canDownloadTranslator,
    isDownloading: isDownloadingTranslator,
    downloadModel: downloadTranslatorModel,
  } = useTranslator();

  const {
    summarize,
    isSummarizerAvailable,
    canDownload: canDownloadSummarizer,
    isDownloading: isDownloadingSummarizer,
    downloadModel: downloadSummarizerModel,
  } = useSummarizer();

  const handleTranslate = async () => {
    setIsLoading(true);
    setError("");

    try {
      const translatedText = await translate(selectedText);
      setResult(translatedText);
    } catch (err) {
      setError("翻訳中にエラーが発生しました。もう一度試してください。");
      console.error("Translation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    setIsLoading(true);
    setError("");

    try {
      const summary = await summarize(selectedText);
      setResult(summary);
    } catch (err) {
      setError("要約中にエラーが発生しました。もう一度試してください。");
      console.error("Summarization error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPreviewText = () => {
    const maxLength = 50;
    return selectedText.length > maxLength
      ? `${selectedText.substring(0, maxLength)}...`
      : selectedText;
  };

  return (
    <div className="gemini-translator-popup">
      <div className="popup-content">
        <div className="popup-header">
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="selected-text-preview">{getPreviewText()}</div>

        <div className="button-container">
          {canDownloadTranslator ? (
            <button
              type="button"
              className="action-btn download-btn"
              onClick={downloadTranslatorModel}
              disabled={isDownloadingTranslator}
            >
              {isDownloadingTranslator
                ? "ダウンロード中..."
                : "翻訳モデルをダウンロード"}
            </button>
          ) : (
            <TranslateButton
              onClick={handleTranslate}
              disabled={!isTranslatorAvailable || isLoading}
            />
          )}

          {canDownloadSummarizer ? (
            <button
              type="button"
              className="action-btn download-btn"
              onClick={downloadSummarizerModel}
              disabled={isDownloadingSummarizer}
            >
              {isDownloadingSummarizer
                ? "ダウンロード中..."
                : "要約モデルをダウンロード"}
            </button>
          ) : (
            <SummarizeButton
              onClick={handleSummarize}
              disabled={!isSummarizerAvailable || isLoading}
            />
          )}
        </div>

        {(result || error || isLoading) && (
          <div className={`result-container ${error ? "error" : ""}`}>
            {isLoading && <div className="loading">処理中...</div>}
            {error && <div className="error-message">{error}</div>}
            {result && !error && !isLoading && (
              <div className="result-text">{result}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslatorPopup;
