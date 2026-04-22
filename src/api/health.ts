import { api } from './client';
import type { HealthReport } from './types';

export function getHealth(): Promise<HealthReport> {
  return api.get<HealthReport>('/health', { unauthenticated: true });
}
