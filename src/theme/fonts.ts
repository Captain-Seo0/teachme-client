import { NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';
import {
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_700Bold,
} from '@expo-google-fonts/noto-sans-kr';

// Passed to expo-font's useFonts. Keys must match names in typography.ts.
// Paperlogy: only the Bold (700) file is loaded because display tokens use only that weight.
export const fontAssets = {
  Paperlogy_700Bold: require('../../assets/images/fonts/Paperlogy/Paperlogy-7Bold.ttf'),
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_700Bold,
  NanumPenScript_400Regular,
};
