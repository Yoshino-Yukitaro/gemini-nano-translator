#!/bin/bash

# SVGアイコンの作成
cat > icon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="16" fill="#4285f4"/>
  <text x="64" y="48" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white">翻</text>
  <text x="64" y="88" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white">訳</text>
</svg>
EOF

# qlmanageを使用してSVGからPNGに変換
echo "Converting SVG to PNG using qlmanage..."

# まず128x128のPNGを生成
qlmanage -t -s 128 -o . icon.svg 2>/dev/null

# 生成されたサムネイルをリネーム
if [ -f "icon.svg.png" ]; then
  mv icon.svg.png public/icons/icon128.png
  echo "Created icon128.png"
  
  # sipsを使用して他のサイズにリサイズ
  sips -z 48 48 public/icons/icon128.png --out public/icons/icon48.png >/dev/null 2>&1
  echo "Created icon48.png"
  
  sips -z 16 16 public/icons/icon128.png --out public/icons/icon16.png >/dev/null 2>&1
  echo "Created icon16.png"
  
  echo "Icons successfully created in public/icons/"
else
  echo "Error: Failed to convert SVG to PNG"
  echo "Creating placeholder files..."
  
  # フォールバック：プレースホルダーファイルを作成
  for size in 16 48 128; do
    touch public/icons/icon${size}.png
  done
  
  echo "Please manually convert icon.svg to PNG formats (16x16, 48x48, 128x128)"
fi

# SVGファイルを保持（必要に応じて後で削除可能）
echo "Original SVG saved as icon.svg"