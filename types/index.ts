export type Values<T> = T[keyof T];

export interface File {
  name: string;
  size: number;
  type: string;
  extension: string;
  content: ArrayBuffer;
}

export interface UploadedFile {
  path: string;
}

export interface RateLimitInfo {
  count: number;
  lastReset: number;
}
