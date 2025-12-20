
export interface ImageState {
  originalUrl: string | null;
  editedUrl: string | null;
  base64: string | null;
  mimeType: string | null;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
