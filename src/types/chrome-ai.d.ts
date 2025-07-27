declare global {
  const Translator: {
    availability: (
      options: TranslationOptions,
    ) => Promise<TranslatorCapabilities>;
    create: (options: TranslationOptions) => Promise<Translator>;
  };

  interface SummarizerMonitor {
    addEventListener(
      event: "downloadprogress",
      callback: (e: DownloadProgressEvent) => void,
    ): void;
  }

  interface DownloadProgressEvent {
    loaded: number; // Progress as a decimal (0-1)
  }

  const Summarizer: {
    availability: () => Promise<SummarizerCapabilities>;
    create: (
      options?: SummarizerOptions & {
        monitor?: (m: SummarizerMonitor) => void;
      },
    ) => Promise<Summarizer>;
  };

  interface Window {
    ai?: {
      languageDetector?: {
        capabilities: () => Promise<LanguageDetectorCapabilities>;
        create: () => Promise<LanguageDetector>;
      };
    };
  }

  interface TranslationOptions {
    sourceLanguage: string;
    targetLanguage: string;
  }

  interface TranslatorCapabilities {
    available: "available" | "downloadable" | "downloading" | "unavailable";
  }

  type TranslationAvailability =
    | "available"
    | "downloadable"
    | "downloading"
    | "unavailable";

  interface Translator {
    translate: (text: string) => Promise<string>;
    ready?: Promise<void>;
    destroy: () => void;
  }

  interface SummarizerCapabilities {
    available: "available" | "downloadable" | "downloading" | "unavailable";
  }

  interface SummarizerOptions {
    type?: "tldr" | "key-points" | "teaser" | "headline";
    format?: "plain-text" | "markdown";
    length?: "short" | "medium" | "long";
  }

  interface Summarizer {
    summarize: (text: string) => Promise<string>;
    ready?: Promise<void>;
    destroy: () => void;
  }

  interface LanguageDetector {
    detect: (
      text: string,
    ) => Promise<Array<{ detectedLanguage: string; confidence: number }>>;
    ready?: Promise<void>;
    destroy: () => void;
  }

  interface LanguageDetectorCapabilities {
    available: "readily" | "after-download" | "no";
  }
}

export {};
