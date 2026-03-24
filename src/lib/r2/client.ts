// Stub: R2 (aws-sdk) not available in edge runtime
export const r2 = null as any;

export function buildR2Key(..._parts: string[]): string {
  return _parts.join('/');
}

export async function getPresignedPutUrl(_key: string, _opts?: unknown): Promise<string> {
  return '';
}
