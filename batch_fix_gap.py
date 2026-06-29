#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re

pages = [
    "auction", "bidding", "court", "creditor", "env-assessment",
    "government", "idcard-page", "invoice-receipt", "labor-dispute",
    "personal-docs", "praise", "publicity"
]

base_path = r"D:\刻章软件\rongcheng-miniprogram\pages\newspaper"

for page in pages:
    wxml_path = os.path.join(base_path, page, "index.wxml")
    wxss_path = os.path.join(base_path, page, "index.wxss")
    
    # 修复 WXML
    if os.path.exists(wxml_path):
        with open(wxml_path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        
        original = content
        # 移除 margin-top 行内样式
        content = re.sub(r'\s*style="margin-top:\s*\{\{navHeight\}\}px;?"', '', content)
        content = re.sub(r"\s*style='margin-top:\s*\{\{navHeight\}\}px;?'", '', content)
        
        if content != original:
            with open(wxml_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"WXML: {page}")
    
    # 修复 WXSS
    if os.path.exists(wxss_path):
        with open(wxss_path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        
        original = content
        
        # 查找 .banner 规则
        banner_match = re.search(r'\.banner\s*\{([^}]*)\}', content, re.DOTALL)
        if banner_match:
            banner_content = banner_match.group(1)
            
            # 检查是否已有 margin-top
            if 'margin-top' in banner_content:
                if 'var(--nav-height' not in banner_content:
                    # 替换现有的 margin-top
                    content = re.sub(
                        r'(\.banner\s*\{[^}]*)(margin-top:\s*[^;]+;)',
                        r'\1margin-top: var(--nav-height, 64px);',
                        content,
                        flags=re.DOTALL
                    )
            else:
                # 添加 margin-top
                content = re.sub(
                    r'(\.banner\s*\{)',
                    r'\1margin-top: var(--nav-height, 64px);',
                    content
                )
            
            if content != original:
                with open(wxss_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"WXSS: {page}")

print("Done!")
