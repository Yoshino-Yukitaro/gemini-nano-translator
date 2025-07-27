import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { afterEach } from 'bun:test';

GlobalRegistrator.register();

// 各テスト後にDOMをクリーンアップ
afterEach(() => {
  document.body.innerHTML = '';
});