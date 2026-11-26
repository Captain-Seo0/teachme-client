import { useFonts } from 'expo-font';

import { fontAssets } from '@/theme';

/** Loads app fonts. Returns true when ready (or when loading failed, to avoid blocking the app). */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts(fontAssets);
  return loaded || error != null;
}
