// Sekmeler-arasi "yardim" aktarimi: Takvim'deki bir gorevin "Yardim"ina basinca
// gorev metni buraya konur ve Simdi sekmesine gecilir; HelpScreen odaklaninca alir.
let pending: string | null = null;

export function requestHelp(text: string): void {
  pending = text;
}

export function takePendingHelp(): string | null {
  const t = pending;
  pending = null;
  return t;
}
