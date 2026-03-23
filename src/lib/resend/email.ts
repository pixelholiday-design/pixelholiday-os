import { Resend } from "resend";

// ─────────────────────────────────────────────────────────────────────────────
// Resend — Transactional email
// ─────────────────────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = process.env.RESEND_FROM_EMAIL ?? "noreply@pixelholiday.com";

export async function sendGalleryReadyEmail(opts: {
  to:         string;
  guestName:  string;
  hotelName:  string;
  galleryUrl: string;
  hookPhotoUrls: string[];
  locale:     string;
}): Promise<string> {
  const subjects: Record<string, string> = {
    en: `Your holiday photos are ready! 📸`,
    de: `Ihre Urlaubsfotos sind bereit! 📸`,
    fr: `Vos photos de vacances sont prêtes ! 📸`,
    th: `รูปถ่ายวันหยุดของคุณพร้อมแล้ว! 📸`,
    ru: `Ваши фото готовы! 📸`,
    zh: `您的度假照片已准备好！📸`,
  };

  const { data, error } = await resend.emails.send({
    from:    FROM,
    to:      opts.to,
    subject: subjects[opts.locale] ?? subjects.en,
    html: buildGalleryReadyHtml(opts),
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  return data?.id ?? "";
}

export async function sendSleepMoneyEmail(opts: {
  to:           string;
  guestName:    string;
  hotelName:    string;
  galleryUrl:   string;
  discountPct:  number;
  couponCode:   string;
  daysLeft:     number;
  locale:       string;
}): Promise<string> {
  const subjects: Record<string, string> = {
    en: `⏰ ${opts.discountPct}% off your holiday photos — ${opts.daysLeft} days left!`,
    de: `⏰ ${opts.discountPct}% Rabatt auf Ihre Urlaubsfotos — noch ${opts.daysLeft} Tage!`,
    fr: `⏰ ${opts.discountPct}% de remise sur vos photos — encore ${opts.daysLeft} jours !`,
    th: `⏰ ลด ${opts.discountPct}% สำหรับรูปถ่ายวันหยุด — เหลือ ${opts.daysLeft} วัท!`,
    ru: `⏰ Скидка ${opts.discountPct}% на ваши фото — осталось ${opts.daysLeft} дней!`,
    zh: `⏰ 您的度假照片 ${opts.discountPct}% 折扣 — 仅剩 ${opts.daysLeft} 天！`,
  };

  const { data, error } = await resend.emails.send({
    from:    FROM,
    to:      opts.to,
    subject: subjects[opts.locale] ?? subjects.en,
    html:    buildSleepMoneyHtml(opts),
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  return data?.id ?? "";
}

// ── HTML templates ──────────────────────────────────────────────────────────

function buildGalleryReadyHtml(opts: {
  guestName:     string;
  hotelName:     string;
  galleryUrl:    string;
  hookPhotoUrls: string[];
}): string {
  const previewImgs = opts.hookPhotoUrls
    .slice(0, 3)
    .map((url) => `<img src="${url}" style="width:200px;height:150px;object-fit:cover;border-radius:8px;margin:4px;" />`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;background:#0f172a;color:#f1f5f9;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#f97316;font-size:28px;margin:0;">PixelHoliday</h1>
      <p style="color:#94a3b8;margin-top:4px;">${opts.hotelName}</p>
    </div>
    <h2 style="font-size:24px;margin-bottom:8px;">Hi ${opts.guestName}! 👋</h2>
    <p style="color:#cbd5e1;line-height:1.6;">
      Your holiday photos are ready to view and download. We captured some amazing moments — take a look!
    </p>
    <div style="text-align:center;margin:24px 0;">${previewImgs}</div>
    <div style="text-align:center;">
      <a href="${opts.galleryUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
        View Your Gallery →
      </a>
    </div>
    <p style="color:#64748b;font-size:12px;text-align:center;margin-top:40px;">
      This link is private and unique to you. Photos stored securely in compliance with GDPR.
    </p>
  </div>
</body>
</html>`;
}

function buildSleepMoneyHtml(opts: {
  guestName:   string;
  hotelName:   string;
  galleryUrl:  string;
  discountPct: number;
  couponCode:  string;
  daysLeft:    number;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;background:#0f172a;color:#f1f5f9;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#f97316;font-size:28px;margin:0;">PixelHoliday</h1>
    </div>
    <div style="background:#f97316;border-radius:16px;padding:32px;text-align:center;margin-bottom:32px;">
      <p style="font-size:48px;margin:0;">🎁</p>
      <h2 style="font-size:36px;margin:8px 0;color:#fff;">${opts.discountPct}% OFF</h2>
      <p style="color:#fff;margin:0;">Your holiday photos from ${opts.hotelName}</p>
    </div>
    <p>Hi ${opts.guestName},</p>
    <p style="color:#cbd5e1;line-height:1.6;">
      We don't want you to miss your holiday memories. For the next <strong style="color:#f97316;">${opts.daysLeft} days</strong>,
      use code <strong style="color:#f97316;">${opts.couponCode}</strong> for <strong style="color:#f97316;">${opts.discountPct}% off</strong>.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${opts.galleryUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
        Claim My Discount →
      </a>
    </div>
    <p style="color:#64748b;font-size:12px;text-align:center;">
      Offer expires in ${opts.daysLeft} days. Stored securely per GDPR guidelines.
    </p>
  </div>
</body>
</html>`;
}
