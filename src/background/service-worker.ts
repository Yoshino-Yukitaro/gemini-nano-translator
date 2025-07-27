// Chrome拡張機能のバックグラウンドサービスワーカー

// 拡張機能のインストール時の処理
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
  } else if (details.reason === 'update') {
  }
});

// Keep service worker alive
self.addEventListener('activate', event => {
});

// 必要に応じて将来的にメッセージ処理を追加可能
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  // とりあえず空のレスポンスを返す
  sendResponse({ success: true });
  
  // 非同期処理の場合は true を返す
  return false;
});