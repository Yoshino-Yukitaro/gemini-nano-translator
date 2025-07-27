#!/bin/bash

# クリーンアップ
rm -rf dist

# TypeScriptのコンパイル
echo "Building content script..."
bun build src/content/index.tsx \
  --outdir=dist/content \
  --target=browser \
  --format=iife \
  --minify

echo "Building background script..."
bun build src/background/service-worker.ts \
  --outdir=dist/background \
  --target=browser \
  --minify

# 静的ファイルのコピー
echo "Copying static files..."
cp manifest.json dist/
mkdir -p dist/icons
cp public/icons/*.png dist/icons/
cp src/content/styles/popup.css dist/content/

echo "Build complete!"