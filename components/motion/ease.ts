// 全站共用的動畫曲線與時間，避免每個元件各寫一套
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.8,
} as const;

// 中日韓字元逐字切分，拉丁字母以「單字」為單位，避免英文在字中間斷行
const TOKEN_PATTERN = /[　-鿿＀-￯]|[^\s　-鿿＀-￯]+|\s+/g;

export type TextToken = { text: string; isSpace: boolean };

export function tokenize(text: string): TextToken[] {
  return (text.match(TOKEN_PATTERN) ?? []).map((part) => ({
    text: part,
    isSpace: /^\s+$/.test(part),
  }));
}
