export const TOKEN_PREFIX = "VALID_USER_";

export function simulatedPause(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
