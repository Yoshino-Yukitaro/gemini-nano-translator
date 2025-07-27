import { useEffect, useState } from "react";
import {
  checkTranslatorAvailability,
  createTranslator,
} from "../../utils/geminiApi";

export const useTranslator = () => {
  const [availability, setAvailability] =
    useState<TranslationAvailability>("unavailable");
  const [translator, setTranslator] = useState<Translator | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  useEffect(() => {
    let currentTranslator: Translator | null = null;

    const checkAvailability = async () => {
      const status = await checkTranslatorAvailability();
      setAvailability(status);
      return status;
    };

    const initTranslator = async () => {
      const status = await checkAvailability();

      if (status === "available") {
        try {
          const trans = await createTranslator();
          currentTranslator = trans;
          setTranslator(trans);
        } catch (error) {
          console.error("Failed to create translator:", error);
        }
      }
    };

    initTranslator();

    return () => {
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
      // Create translator which will trigger download
      const trans = await createTranslator();

      // Monitor download progress if ready promise is available
      if (trans.ready) {
        await trans.ready;
      }

      setTranslator(trans);
      setAvailability("available");
      setDownloadProgress(100);
    } catch (error) {
      console.error("Failed to download translator model:", error);
      setAvailability("unavailable");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  const translate = async (text: string): Promise<string> => {
    if (!translator) {
      throw new Error("Translator not available");
    }

    return translator.translate(text);
  };

  return {
    translate,
    availability,
    isTranslatorAvailable: availability === "available",
    canDownload: availability === "downloadable",
    isDownloading,
    downloadProgress,
    downloadModel,
  };
};
