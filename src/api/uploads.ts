import { api } from './client';

export interface PersistedUpload {
  id: string;
  key: string;
  url: string;
  mime: string;
  sizeBytes: number;
}

const extensionToMime: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heic',
};

const inferMime = (uri: string, explicit?: string | null): string => {
  if (explicit) return explicit;
  const ext = uri.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  return extensionToMime[ext] ?? 'image/jpeg';
};

export async function uploadImage(uri: string, mimeType?: string | null): Promise<PersistedUpload> {
  const mime = inferMime(uri, mimeType);
  const ext = mime.split('/')[1] ?? 'jpg';
  const form = new FormData();
  // React Native + fetch on Expo expects the `{ uri, name, type }` shape here.
  form.append('file', {
    uri,
    name: `upload.${ext === 'jpeg' ? 'jpg' : ext}`,
    type: mime,
  } as unknown as Blob);

  return api.post<PersistedUpload>('/uploads', form);
}
