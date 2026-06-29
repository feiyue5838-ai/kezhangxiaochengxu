#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re

pages = [
    "announcement", "auction", "bidding", "court", "government",
    "personal-docs", "praise", "publicity", "apology"
]

base_path = r"D:\刻章软件\rongcheng-miniprogram\pages\newspaper"

for page in pages:
    wxss_path = os.path.join(base_path, page, "index.wxss")
    
    if os.path.exists(wxss_path):
        with open(wxss_path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        
        original = content
        
        # Fix .banner-title - add text-align: center before closing }
        content = re.sub(
            r'(\.banner-title\s*\{[^}]+?)(\s*\})',
            lambda m: m.group(1) + '\n  text-align: center;' + m.group(2) if 'text-align' not in m.group(1) else m.group(0),
            content,
            flags=re.DOTALL
        )
        
        # Fix .banner-subtitle - add text-align: center before closing }
        content = re.sub(
            r'(\.banner-subtitle\s*\{[^}]+?)(\s*\})',
            lambda m: m.group(1) + '\n  text-align: center;' + m.group(2) if 'text-align' not in m.group(1) else m.group(0),
            content,
            flags=re.DOTALL
        )
        
        if content != original:
            with open(wxss_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {page}")
        else:
            print(f"No change: {page}")

print("Done!")
