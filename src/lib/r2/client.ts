import S3 from "aws-sdk/clients/s3";

// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare R2 S3-compatible client
// ─────────────────────────────────────────────────────────────────────────────

export const r2 = new S3({
  endpoint:        `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId:     process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  region:          "auto",
  signatureVersion: "v4",
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? "pixelholiday-photos";

/**
 * Generate a presigned PUT URL for direct-to-R2 upload.
 * Expires in 15 minutes.
 */
export async function getPresignedPutUrl(
  key:         string,
  contentType: string,
  expiresIn:   number = 900
): Promise<string> {
  return r2.getSignedUrlPromise("putObject", {
    Bucket:      R2_BUCKET,
    Key:         key,
    ContentType: contentType,
    Expires:     expiresIn,
  });
}

/**
 * Generate a presigned GET URL for private object retrieval.
 */
export async function getPresignedGetUrl(
  key:       string,
  expiresIn: number = 3600
): Promise<string> {
  return r2.getSignedUrlPromise("getObject", {
    Bucket:  R2_BUCKET,
    Key:     key,
    Expires: expiresIn,
  });
}

/**
 * Build R2 key for a photo upload.
 * Pattern: galleries/{galleryId}/{uuid}.{ext}
 */
export function buildR2Key(galleryId: string, fileName: string, prefix = ""): string {
  const ext  = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const uuid = crypto.randomUUID();
  return `galleries/${galleryId}/${prefix}${uuid}.${ext}`;
}

/**
 * Delete an object from R2.
 */
export async function deleteR2Object(key: string): Promise<void> {
  await r2.deleteObject({ Bucket: R2_BUCKET, Key: key }).promise();
}
