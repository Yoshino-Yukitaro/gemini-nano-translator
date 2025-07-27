import { summaryCache, translationCache } from "./cache";

// 翻訳API関連
export async function checkTranslatorAvailability(): Promise<TranslationAvailability> {
  if (!("Translator" in self)) {
    return "unavailable";
  }

  try {
    const result = await Translator.availability({
      sourceLanguage: "en",
      targetLanguage: "ja",
    });

    // 直接文字列として返される場合
    if (typeof result === "string") {
      return result as TranslationAvailability;
    }

    // オブジェクトの場合（念のため）
    if (result && typeof result === "object" && "available" in result) {
      return result.available;
    }

    return "unavailable";
  } catch (error) {
    console.error("Translation availability check failed:", error);
    return "unavailable";
  }
}

export async function createTranslator(): Promise<Translator> {
  if (!("Translator" in self)) {
    throw new Error("Translator API not available");
  }

  const translator = await Translator.create({
    sourceLanguage: "en",
    targetLanguage: "ja",
  });

  // キャッシュ付き翻訳関数でラップ
  const originalTranslate = translator.translate.bind(translator);
  translator.translate = async (text: string) => {
    const cached = translationCache.get(text);
    if (cached) {
      return cached;
    }

    const result = await originalTranslate(text);
    translationCache.set(text, result);
    return result;
  };

  return translator;
}

// 要約API関連
export async function checkSummarizerAvailability(): Promise<
  "available" | "downloadable" | "downloading" | "unavailable"
> {
  if (!("Summarizer" in self)) {
    return "unavailable";
  }

  try {
    const result = await Summarizer.availability();

    // 直接文字列として返される場合
    if (typeof result === "string") {
      return result as
        | "available"
        | "downloadable"
        | "downloading"
        | "unavailable";
    }

    // オブジェクトの場合（念のため）
    if (result && typeof result === "object" && "available" in result) {
      return result.available;
    }

    return "unavailable";
  } catch (error) {
    console.error("Summarizer availability check failed:", error);
    return "unavailable";
  }
}

export async function createSummarizer(
  onProgress?: (progress: number) => void,
): Promise<Summarizer> {
  if (!("Summarizer" in self)) {
    throw new Error("Summarizer API not available");
  }

  const options: SummarizerCreateOptions = {
    type: "tldr",
    format: "plain-text",
    length: "short",
  };

  if (onProgress) {
    options.monitor = (m: SummarizerMonitor) => {
      m.addEventListener("downloadprogress", (e) => {
        onProgress(e.loaded * 100);
      });
    };
  }

  const summarizer = await Summarizer.create(options);

  // キャッシュ付き要約関数でラップ
  const originalSummarize = summarizer.summarize.bind(summarizer);
  summarizer.summarize = async (text: string) => {
    const cached = summaryCache.get(text);
    if (cached) {
      return cached;
    }

    const result = await originalSummarize(text);
    summaryCache.set(text, result);
    return result;
  };

  return summarizer;
}
