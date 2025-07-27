// Chrome拡張機能のバックグラウンドサービスワーカー
console.log('Gemini Nano Translator - Service Worker loaded');

// 拡張機能のインストール時の処理
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Gemini Nano Translator installed');
  } else if (details.reason === 'update') {
    console.log('Gemini Nano Translator updated');
  }
});

// Keep service worker alive
self.addEventListener('activate', event => {
  console.log('Service worker activated');
});

// 必要に応じて将来的にメッセージ処理を追加可能
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  // とりあえず空のレスポンスを返す
  sendResponse({ success: true });
  
  // 非同期処理の場合は true を返す
  return false;
});