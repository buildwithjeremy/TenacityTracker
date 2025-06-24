import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return 'Less than an hour ago';
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return d.toLocaleDateString();
  }
}

export function calculateProgress(stage: number, totalSteps: number = 13): number {
  return Math.round((stage / totalSteps) * 100);
}

export function getStageTitle(stage: number): string {
  if (stage <= 3) return 'Onboarding';
  if (stage <= 7) return 'Field Training';
  if (stage <= 10) return 'Advanced Training';
  if (stage <= 13) return 'Independence Path';
  return 'Graduated';
}

export function getStageColor(stage: number): string {
  if (stage <= 3) return 'primary';
  if (stage <= 7) return 'accent';
  if (stage <= 10) return 'secondary';
  return 'secondary';
}
