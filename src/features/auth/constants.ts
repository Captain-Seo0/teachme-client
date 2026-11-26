export const MIN_PASSWORD_LENGTH = 8;

// Onboarding screens that a signed-in user should be moved away from.
export const AUTH_SCREENS = ['login', 'email-login', 'signup'] as const;

// Where to go right after a successful sign-in / sign-up.
// TODO: once the profiles table exists, send new users (email sign-up, first social login)
// to '/(onboarding)/profile' and existing users to '/(tabs)'.
export const POST_AUTH_HREF = '/(tabs)' as const;
