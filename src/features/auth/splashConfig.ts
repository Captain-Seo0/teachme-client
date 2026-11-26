import { Easing } from 'react-native';

// Splash motion. Figma only defines the start (pieces, node 1:426) and end (logo, node 1:419);
// these values are chosen freely and are meant to be tweaked here.
// Timeline: pieces 0 -> 740ms, hold -> 900ms, crossfade -> 1220ms, end hold -> 1500ms.
export const SPLASH = {
  pieceDuration: 380, // each piece's entrance
  pieceStagger: 180, // delay between pieces: left square -> triangle -> right square
  pieceRise: 24, // px each piece travels up while appearing
  triangleStartScale: 0.6,
  holdAfterPieces: 160, // pause before pieces turn into the logo
  crossfadeDuration: 320, // pieces -> final logo
  holdAfterLogo: 280, // pause on the finished logo before leaving
  pieceEasing: Easing.out(Easing.cubic),
  crossfadeEasing: Easing.inOut(Easing.quad),
} as const;
