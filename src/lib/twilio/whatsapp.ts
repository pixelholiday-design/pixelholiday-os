import twilio from "twilio";

// ─────────────────────────────────────────────────────────────────────────────
// Twilio — WhatsApp messaging for guest notifications
// ─────────────────────────────────────────────────────────────────────────────

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";

export interface WhatsAppMessageParams {
  to:      string; // E.164 number, e.g. +66812345678
  body:    string;
  mediaUrls?: string[];
}

/**
 * Send a WhatsApp message via Twilio.
 * `to` must be E.164 format; Twilio will prepend "whatsapp:" automatically.
 */
export async function sendWhatsApp(params: WhatsAppMessageParams): Promise<string> {
  const toWhatsApp = params.to.startsWith("whatsapp:") ? params.to : `whatsapp:${params.to}`;

  const message = await client.messages.create({
    from:     FROM,
    to:       toWhatsApp,
    body:     params.body,
    mediaUrl: params.mediaUrls,
  });

  return message.sid;
}

/**
 * Build localised WhatsApp message bodies for Sleep Money campaigns.
 */
export function buildSleepMoneyMessage(opts: {
  locale:        string;
  guestName:     string;
  discountPct:   number;
  galleryUrl:    string;
  hotelName:     string;
  expiresInDays: number;
}): string {
  const { locale, guestName, discountPct, galleryUrl, hotelName, expiresInDays } = opts;

  const messages: Record<string, string> = {
    en: `Hi ${guestName}! 👋 We miss you! 📸 Your photos from ${hotelName} are still waiting. Use code *SAVE${discountPct}* for ${discountPct}% OFF — but hurry, this offer expires in ${expiresInDays} days! 🎁\n\nView your gallery: ${galleryUrl}`,
    de: `Hallo ${guestName}! 👋 Wir vermissen Sie! 📸 Ihre Fotos von ${hotelName} warten noch. Nutzen Sie Code *SAVE${discountPct}* für ${discountPct}% RABATT — Angebot endet in ${expiresInDays} Tagen! 🎁\n\nIhre Galerie: ${galleryUrl}`,
    fr: `Bonjour ${guestName} ! 👋 Vos photos de ${hotelName} vous attendent ! Utilisez le code *SAVE${discountPct}* pour ${discountPct}% de remise — offre valable ${expiresInDays} jours ! 🎁\n\nVotre galerie : ${galleryUrl}`,
    th: `สวัสดี ${guestName}! 👋 รูปถ่ายของคุณจาก${hotelName}ยังรออยู่! ใช้โค้ด *SAVE${discountPct}* รับส่วนลด ${discountPct}% — ใช้ได้ใน ${expiresInDays} วัน! 🎁\n\nดูแกลเลอรี่: ${galleryUrl}`,
    ru: `Привет, ${guestName}! 👋 Ваши фото из ${hotelName} всё ещё ждут! Используйте код *SAVE${discountPct}* для скидки ${discountPct}% — предложение истекает через ${expiresInDays} дней! 🎁\n\nВаша галерея: ${galleryUrl}`,
    zh: `您好，${guestName}！👋 您在${hotelName}的照片还在等您！使用代码 *SAVE${discountPct}* 享受 ${discountPct}% 折扣——优惠 ${expiresInDays} 天后到期！🎁\n\n查看相册：${galleryUrl}`,
  };

  return messages[locale] ?? messages.en;
}
