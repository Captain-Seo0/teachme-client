import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

import { useAuth } from '../AuthProvider';
import {
  Logo,
  LOGO_HEIGHT,
  LOGO_WIDTH,
  LogoSquare,
  LogoTriangle,
  SQUARE_SIZE,
  TRIANGLE_SIZE,
} from '../components/LogoGraphics';
import { SPLASH } from '../splashConfig';

// Piece positions inside the 250 x 83 logo box (from Figma node 1:426 vs 1:419).
const LEFT_SQUARE = { left: 0, top: 9 };
const TRIANGLE = { left: 82.6, top: -1 };
const RIGHT_SQUARE = { left: 174, top: 9 };

/** Three pieces assemble into the logo, then the root layout routes by session state. */
export function SplashScreen() {
  const { completeSplash } = useAuth();
  const pieces = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const crossfade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel(
        pieces.map((value, index) =>
          Animated.timing(value, {
            toValue: 1,
            duration: SPLASH.pieceDuration,
            delay: index * SPLASH.pieceStagger,
            easing: SPLASH.pieceEasing,
            useNativeDriver: true,
          }),
        ),
      ),
      Animated.delay(SPLASH.holdAfterPieces),
      Animated.timing(crossfade, {
        toValue: 1,
        duration: SPLASH.crossfadeDuration,
        easing: SPLASH.crossfadeEasing,
        useNativeDriver: true,
      }),
      Animated.delay(SPLASH.holdAfterLogo),
    ]);
    animation.start(({ finished }) => {
      if (finished) completeSplash();
    });
    return () => animation.stop();
  }, [pieces, crossfade, completeSplash]);

  const rise = (value: Animated.Value) =>
    value.interpolate({ inputRange: [0, 1], outputRange: [SPLASH.pieceRise, 0] });

  const piecesOpacity = crossfade.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: piecesOpacity }]}>
          <Animated.View
            style={[
              styles.piece,
              LEFT_SQUARE,
              { width: SQUARE_SIZE.width, height: SQUARE_SIZE.height },
              { opacity: pieces[0], transform: [{ translateY: rise(pieces[0]) }] },
            ]}
          >
            <LogoSquare />
          </Animated.View>
          <Animated.View
            style={[
              styles.piece,
              TRIANGLE,
              { width: TRIANGLE_SIZE.width, height: TRIANGLE_SIZE.height },
              {
                opacity: pieces[1],
                transform: [
                  { translateY: rise(pieces[1]) },
                  {
                    scale: pieces[1].interpolate({
                      inputRange: [0, 1],
                      outputRange: [SPLASH.triangleStartScale, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <LogoTriangle />
          </Animated.View>
          <Animated.View
            style={[
              styles.piece,
              RIGHT_SQUARE,
              { width: SQUARE_SIZE.width, height: SQUARE_SIZE.height },
              { opacity: pieces[2], transform: [{ translateY: rise(pieces[2]) }] },
            ]}
          >
            <LogoSquare />
          </Animated.View>
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: crossfade }]}>
          <Logo />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.canvas,
  },
  logoBox: { width: LOGO_WIDTH, height: LOGO_HEIGHT },
  piece: { position: 'absolute' },
});
