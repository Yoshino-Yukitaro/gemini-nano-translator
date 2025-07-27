import { describe, expect, test } from "bun:test";
import { LRUCache } from "../cache";

describe("LRUCache", () => {
  test("should store and retrieve values", () => {
    const cache = new LRUCache<string>(3);
    cache.set("key1", "value1");
    expect(cache.get("key1")).toBe("value1");
  });

  test("should evict least recently used items", () => {
    const cache = new LRUCache<string>(2);
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3"); // key1 should be evicted

    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBe("value2");
    expect(cache.get("key3")).toBe("value3");
  });

  test("should move accessed items to the end", () => {
    const cache = new LRUCache<string>(3);
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3");

    // Access key1 to move it to the end
    cache.get("key1");

    // Add key4, which should evict key2 (now the oldest)
    cache.set("key4", "value4");

    expect(cache.get("key1")).toBe("value1");
    expect(cache.get("key2")).toBeUndefined();
    expect(cache.get("key3")).toBe("value3");
    expect(cache.get("key4")).toBe("value4");
  });

  test("should update existing keys without changing order", () => {
    const cache = new LRUCache<string>(2);
    cache.set("key1", "value1");
    cache.set("key2", "value2");

    // Update key1
    cache.set("key1", "newValue1");

    // Add key3, which should evict key2
    cache.set("key3", "value3");

    expect(cache.get("key1")).toBe("newValue1");
    expect(cache.get("key2")).toBeUndefined();
    expect(cache.get("key3")).toBe("value3");
  });

  test("should clear all items", () => {
    const cache = new LRUCache<string>(3);
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3");

    cache.clear();

    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBeUndefined();
    expect(cache.get("key3")).toBeUndefined();
  });
});
