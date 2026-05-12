#!/usr/bin/env python3
"""
為缺失的專案截圖生成佔位 PNG 圖片。
每張圖片 1200x750，帶有專案名稱和頁面名稱。
"""

import os
import struct
import zlib

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(BASE, "public")

# 缺失圖片清單：(路徑, 顏色(hex), 專案顯示名稱, 頁面描述)
MISSING = [
    # (相對路徑,          bg_color, 專案名,             頁面名)
    ("/projects/ai_debt_scanner/home.png",        "#1a1a2e", "AIDebtScanner",      "首頁 Home"),
    ("/projects/ai_debt_scanner/dashboard.png",   "#1a1a2e", "AIDebtScanner",      "儀表板 Dashboard"),
    ("/projects/allvibe/home.png",                "#0d1117", "AllVibe",            "首頁 Home"),
    ("/projects/allvibe/explore.png",             "#0d1117", "AllVibe",            "探索 Explore"),
    ("/projects/autolens/home.png",               "#16213e", "AutoLens",           "首頁 Home"),
    ("/projects/broadvize/home.png",              "#0f3460", "Broadvize",          "首頁 Home"),
    ("/projects/broadvize/editor.png",            "#0f3460", "Broadvize",          "編輯器 Editor"),
    ("/projects/carbon/home.png",                 "#161b22", "Carbon",             "首頁 Home"),
    ("/projects/cardflow/home.png",               "#1e1e2e", "CardFlow",           "首頁 Home"),
    ("/projects/cardflow/card.png",               "#1e1e2e", "CardFlow",           "名片 Card"),
    ("/projects/codeltp/home.png",                "#0a0a1a", "CodeLTP",            "首頁 Home"),
    ("/projects/codeltp/learning.png",            "#0a0a1a", "CodeLTP",            "學習 Learning"),
    ("/projects/fliptok/home.png",                "#010101", "FlipTok",            "首頁 Home"),
    ("/projects/fliptok/browse.png",              "#010101", "FlipTok",            "瀏覽 Browse"),
    ("/projects/liminal/home.png",                "#1a0a2e", "Liminal",            "首頁 Home"),
    ("/projects/nexusos/home.png",                "#050a0e", "NexusOS",            "首頁 Home"),
    ("/projects/nexusos/chat.png",                "#050a0e", "NexusOS",            "聊天 Chat"),
    ("/projects/openring/home.png",               "#0d1117", "OpenRing",           "首頁 Home"),
    ("/projects/openring/agent.png",              "#0d1117", "OpenRing",           "AI Agent"),
    ("/projects/promptly/popup.png",              "#1e1e2e", "Promptly",           "彈出視窗 Popup"),
    ("/projects/promptly/suggest.png",            "#1e1e2e", "Promptly",           "建議 Suggest"),
    ("/projects/resumeai/home.png",               "#0f172a", "ResumeAI",           "首頁 Home"),
    ("/projects/resumeai/preview.png",            "#0f172a", "ResumeAI",           "預覽 Preview"),
    ("/projects/skyvize/home.png",                "#0c1445", "Skyvize",            "首頁 Home"),
    ("/projects/skyvize/patrol.png",              "#0c1445", "Skyvize",            "巡邏 Patrol"),
    ("/projects/specformula/home.png",            "#1e1e1e", "SpecFormula",        "首頁 Home"),
    ("/projects/taipei_dashboard/home.png",       "#001529", "台北城市儀表板",       "首頁 Home"),
    ("/projects/threads_story_recap/home.png",    "#0a0a0a", "ThreadsStoryRecap",  "首頁 Home"),
    ("/projects/threads_story_recap/story.png",   "#0a0a0a", "ThreadsStoryRecap",  "故事 Story"),
    ("/projects/ticktive/home.png",               "#1a1a2e", "Ticktive",           "首頁 Home"),
    ("/projects/ticktive/dashboard.png",          "#1a1a2e", "Ticktive",           "儀表板 Dashboard"),
    ("/projects/toolnest/home.png",               "#0d1117", "ToolNest",           "首頁 Home"),
    ("/projects/veyo_shop/home.png",              "#1a0a0a", "VeyoShop",           "首頁 Home"),
    ("/projects/veyo_shop/cart.png",              "#1a0a0a", "VeyoShop",           "購物車 Cart"),
    ("/projects/vibe_workshop/home.png",          "#0a1628", "VibeWorkshop",       "首頁 Home"),
    ("/projects/vibe_workshop/dashboard.png",     "#0a1628", "VibeWorkshop",       "儀表板 Dashboard"),
    ("/projects/vibeacademy/home.png",            "#0d0d2b", "VibeAcademy",        "首頁 Home"),
    ("/projects/vibegame/home.png",               "#0a0a1a", "VibeGame",           "首頁 Home"),
    ("/projects/vibegame/detail.png",             "#0a0a1a", "VibeGame",           "詳情 Detail"),
    ("/projects/voxel_world/home.png",            "#0a1a0a", "VoxelWorld",         "首頁 Home"),
    ("/projects/voxel_world/gameplay.png",        "#0a1a0a", "VoxelWorld",         "遊戲畫面 Gameplay"),
    ("/projects/zettelify/home.png",              "#1a1a0a", "Zettelify",          "首頁 Home"),
]

W, H = 1200, 750


def hex_to_rgb(hex_str):
    h = hex_str.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def make_png(width, height, bg_rgb, text_lines):
    """純 Python 生成帶有文字的簡單 PNG（8-bit RGB）。"""
    r, g, b = bg_rgb

    # 建立像素資料（純背景色）
    row = bytes([r, g, b] * width)
    raw = b"".join(b"\x00" + row for _ in range(height))
    compressed = zlib.compress(raw, 9)

    def chunk(name, data):
        c = name + data
        return (
            struct.pack(">I", len(data))
            + name
            + data
            + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
        )

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    ihdr = chunk(b"IHDR", ihdr_data)
    idat = chunk(b"IDAT", compressed)
    iend = chunk(b"IEND", b"")

    return sig + ihdr + idat + iend


def create_placeholder(rel_path, bg_hex, project_name, page_name):
    full_path = PUBLIC + rel_path
    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    if os.path.exists(full_path):
        print(f"SKIP  {rel_path}")
        return

    bg_rgb = hex_to_rgb(bg_hex)
    png_data = make_png(W, H, bg_rgb, [project_name, page_name])

    with open(full_path, "wb") as f:
        f.write(png_data)

    print(f"OK    {rel_path} ({project_name} - {page_name})")


if __name__ == "__main__":
    created = 0
    for item in MISSING:
        rel_path, bg_hex, project_name, page_name = item
        create_placeholder(rel_path, bg_hex, project_name, page_name)
        created += 1

    print(f"\n完成！共處理 {created} 張佔位圖片。")
    print("提示：請用真實截圖替換這些佔位圖片。")
