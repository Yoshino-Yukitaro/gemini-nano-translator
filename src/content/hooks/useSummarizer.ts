import { useEffect, useState } from "react";
import {
  checkSummarizerAvailability,
  createSummarizer,
} from "../../utils/geminiApi";

export const useSummarizer = () => {
  const [availability, setAvailability] = useState<
    "available" | "downloadable" | "downloading" | "unavailable"
  >("unavailable");
  const [summarizer, setSummarizer] = useState<Summarizer | null>(null);
  const [translator, setTranslator] = useState<Translator | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const checkAvailability = async () => {
    const status = await checkSummarizerAvailability();
    setAvailability(status);
    return status;
  };

  useEffect(() => {
    let currentSummarizer: Summarizer | null = null;
    let currentTranslator: Translator | null = null;

    const initSummarizer = async () => {
      const status = await checkSummarizerAvailability();
      setAvailability(status);

      if (status === "available") {
        try {
          const summ = await createSummarizer();
          currentSummarizer = summ;
          setSummarizer(summ);

          // 要約結果を日本語に翻訳するための翻訳器も初期化
          if ("Translator" in self) {
            const trans = await Translator.create({
              sourceLanguage: "en",
              targetLanguage: "ja",
            });
            currentTranslator = trans;
            setTranslator(trans);
          }
        } catch (error) {
          console.error("Failed to create summarizer:", error);
        }
      }
    };

    initSummarizer();

    return () => {
      if (currentSummarizer) {
        currentSummarizer.destroy();
      }
      if (currentTranslator) {
        currentTranslator.destroy();
      }
    };
  }, []);

  const downloadModel = async () => {
    if (availability !== "downloadable" || isDownloading) {
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Create summarizer which will trigger download with progress monitoring
      const summ = await createSummarizer((progress) => {
        setDownloadProgress(progress);
      });

      setSummarizer(summ);

      // ダウンロード完了後、再度availabilityを確認
      const newStatus = await checkAvailability();

      if (newStatus === "available") {
        // Also create translator for Japanese translation
        if ("Translator" in self) {
          try {
            const trans = await Translator.create({
              sourceLanguage: "en",
              targetLanguage: "ja",
            });
            setTranslator(trans);
          } catch (error) {
            console.error("Failed to create translator:", error);
          }
        }

        setAvailability("available");
        setDownloadProgress(100);
      } else {
        console.error("Summarizer still not available after download");
        setAvailability(newStatus);
      }
    } catch (error) {
      console.error("Failed to download summarizer model:", error);
      setAvailability("unavailable");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  const summarize = async (text: string): Promise<string> => {
    if (!summarizer) {
      throw new Error("Summarizer not available");
    }

    // 要約を実行
    const summary = await summarizer.summarize(text);

    // 要約結果を日本語に翻訳
    if (translator) {
      try {
        return await translator.translate(summary);
      } catch (error) {
        console.error("Failed to translate summary:", error);
        return summary; // 翻訳に失敗した場合は英語の要約を返す
      }
    }

    return summary;
  };

  return {
    summarize,
    availability,
    isSummarizerAvailable: availability === "available",
    canDownload: availability === "downloadable",
    isDownloading,
    downloadProgress,
    downloadModel,
  };
};
