import { createRoot } from "react-dom/client";
import TranslatorPopup from "./components/TranslatorPopup";
import "./styles/popup.css";

// Reactアプリケーションのマウントポイント
let root: ReturnType<typeof createRoot> | null = null;
let container: HTMLDivElement | null = null;
let isMouseOverPopup = false;
let hideTimeout: NodeJS.Timeout | null = null;

// テキスト選択の監視
function initializeContentScript() {
  document.addEventListener("mouseup", handleMouseUp);

  // ドキュメント全体のクリックイベントを監視（ポップアップ外クリックで閉じる）
  document.addEventListener("click", (e) => {
    if (container && !container.contains(e.target as Node)) {
      hidePopup(false);
    }
  });
}

function handleMouseUp(e: MouseEvent) {
  // ポップアップ内でのクリックは無視
  if (container?.contains(e.target as Node)) {
    return;
  }

  // 少し遅延を入れて選択テキストを確認
  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || "";

    if (text.length > 0 && selection) {
      showPopup(selection, text);
    }
  }, 10);
}

function showPopup(selection: Selection, text: string) {
  // 既存のポップアップを削除
  hidePopup();

  // 選択範囲の座標を取得
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // コンテナ要素の作成
  container = document.createElement("div");
  container.id = "gemini-translator-root";
  container.style.position = "absolute";
  container.style.left = `${rect.left + window.scrollX}px`;
  container.style.top = `${rect.bottom + window.scrollY + 10}px`;
  container.style.zIndex = "10000";

  // ポップアップ上でのマウスイベントを管理
  container.addEventListener("mouseenter", () => {
    isMouseOverPopup = true;
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  });

  container.addEventListener("mouseleave", () => {
    isMouseOverPopup = false;
  });

  document.body.appendChild(container);

  // Reactアプリケーションのマウント
  root = createRoot(container);
  root.render(
    <TranslatorPopup selectedText={text} onClose={() => hidePopup(true)} />,
  );
}

function hidePopup(force: boolean = false) {
  // マウスがポップアップ上にある場合は消さない（強制的に閉じる場合を除く）
  if (!force && isMouseOverPopup) {
    return;
  }

  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  if (root) {
    root.unmount();
    root = null;
  }
  if (container) {
    container.remove();
    container = null;
  }

  isMouseOverPopup = false;
}

// 初期化
initializeContentScript();
