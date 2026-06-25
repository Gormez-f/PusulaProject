// Tarih yardimcilari (Turkce, kutuphanesiz). Ajanda gruplama + etiketleme.
const DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const pad = (n: number) => String(n).padStart(2, '0');
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export type Bucket = 'today' | 'tomorrow' | 'week' | 'later' | 'none';

export const BUCKETS: Array<{ key: Bucket; label: string }> = [
  { key: 'today', label: 'Bugün' },
  { key: 'tomorrow', label: 'Yarın' },
  { key: 'week', label: 'Bu hafta' },
  { key: 'later', label: 'Sonra' },
  { key: 'none', label: 'Tarihsiz' },
];

export function bucketOf(due?: string): Bucket {
  if (!due) return 'none';
  const diff = Math.round((startOfDay(new Date(due)) - startOfDay(new Date())) / 86400000);
  if (diff <= 0) return 'today'; // bugun veya gecmis -> bugun grubunda
  if (diff === 1) return 'tomorrow';
  if (diff <= 7) return 'week';
  return 'later';
}

export function isOverdue(due?: string): boolean {
  return !!due && new Date(due).getTime() < Date.now();
}

export function formatDue(due: string): string {
  const d = new Date(due);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const b = bucketOf(due);
  if (isOverdue(due) && b === 'today') return `Gecikti · ${time}`;
  if (b === 'today') return `Bugün ${time}`;
  if (b === 'tomorrow') return `Yarın ${time}`;
  if (b === 'week') return `${DAYS[d.getDay()]} ${time}`;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${time}`;
}
