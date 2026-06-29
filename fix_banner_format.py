#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re

pages = ["auction", "bidding"]
base_path = r"D:\刻章软件\rongcheng-miniprogram\pages\newspaper"

for page in pages:
    wxss_path = os.path.join(base_path, page, "index.wxss")
    
    if os.path.exists(wxss_path):
        with open(wxss_path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        
        original = content
        
        # Fix .banner-title - 重新格式化为多行
        content = re.sub(
            r'\.banner-title\s*\{[^}]+\}',
            '''.banner-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 12rpx;
  position: relative;
  z-index: 1;
  text-align: center;
}''',
            content
        )
        
        # Fix .banner-subtitle - 重新格式化为多行
        content = re.sub(
            r'\.banner-subtitle\s*\{[^}]+\}',
            '''.banner-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
  margin-bottom: 20rpx;
  position: relative;
  z-index: 1;
  text-align: center;
}''',
            content
        )
        
        if content != original:
            with open(wxss_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {page}")
        else:
            print(f"No change: {page}")

print("Done!")
