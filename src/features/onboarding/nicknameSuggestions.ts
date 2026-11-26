import { validateNickname } from './nickname';

// Modifier + noun combinations, e.g. 대치동 + 호랑이 = 대치동호랑이.
const MODIFIERS = [
  '대치동', '설명', '개념', '열정', '집중', '척척', '밤샘', '만능', '꼼꼼', '든든', '별빛', '새벽',
];
const NOUNS = [
  '호랑이', '왕자', '요정', '박사', '쌤', '고래', '토끼', '곰돌이', '다람쥐', '부엉이',
];

const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** Returns `count` distinct random suggestions that satisfy the nickname format rules. */
export function pickNicknameSuggestions(count = 3, exclude: readonly string[] = []): string[] {
  const result = new Set<string>();
  let guard = 0;
  while (result.size < count && guard++ < 100) {
    const candidate = `${pick(MODIFIERS)}${pick(NOUNS)}`;
    if (!exclude.includes(candidate) && validateNickname(candidate) === null) result.add(candidate);
  }
  return [...result];
}
