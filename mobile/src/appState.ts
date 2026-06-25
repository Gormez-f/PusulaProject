// Ben sekmesinden onboarding'e geri donmek icin kucuk kopru.
// App.tsx bir dinleyici kaydeder; Ben sekmesi tetikler.
let resetListener: (() => void) | null = null;

export function registerOnboardingReset(cb: () => void): void {
  resetListener = cb;
}

export function showOnboardingAgain(): void {
  resetListener?.();
}
