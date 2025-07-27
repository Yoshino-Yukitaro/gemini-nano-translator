export class LRUCache<T> {
  private cache: Map<string, T>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // 最近使用したアイテムを最後に移動
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: string, value: T): void {
    // 既存のキーの場合は削除して最後に追加
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // キャッシュサイズの制限
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const translationCache = new LRUCache<string>(100);
export const summaryCache = new LRUCache<string>(50);
