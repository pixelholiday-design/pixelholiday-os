import { Client } from "@upstash/qstash";
import { addDays } from "date-fns";

// ─────────────────────────────────────────────────────────────────────────────
// Upstash QStash — Sleep Money cascade scheduler
// ─────────────────────────────────────────────────────────────────────────────

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Sleep Money schedule: day → discount %
export const SLEEP_MONEY_SCHEDULE = [
  { day: 7,  discountPct: 50 },
  { day: 15, discountPct: 60 },
  { day: 20, discountPct: 70 },
  { day: 30, discountPct: 80 },
] as const;

export interface ScheduleSleepMoneyParams {
  galleryId:     string;
  shootDate:     Date;
  customerEmail: string | null;
  whatsappNumber: string | null;
  locale:        string;
}

/**
 * Schedule all 4 Sleep Money drip messages for a gallery.
 * Each message fires on day 7, 15, 20, 30 after shoot date.
 */
export async function scheduleSleepMoneyDrip(
  params: ScheduleSleepMoneyParams
): Promise<void> {
  const { galleryId, shootDate } = params;

  for (const { day, discountPct } of SLEEP_MONEY_SCHEDULE) {
    const fireAt  = addDays(new Date(shootDate), day);
    const delay   = Math.max(0, fireAt.getTime() - Date.now());

    if (delay <= 0) continue; // skip past dates

    const messageId = await qstash.publishJSON({
      url:  `${APP_URL}/api/cron/sleep-money`,
      body: {
        galleryId,
        discountPct,
        day,
        locale:        params.locale,
        customerEmail: params.customerEmail,
        whatsappNumber: params.whatsappNumber,
      },
      delay: Math.floor(delay / 1000), // QStash expects seconds
    });

    // Persist the QStash message ID so we can cancel if gallery is fully sold
    await import("@/lib/db/prisma").then(({ db }) =>
      db.sleepMoneyJob.create({
        data: {
          galleryId,
          channel:         params.whatsappNumber ? "WHATSAPP" : "EMAIL",
          discountPct,
          scheduledDay:    day,
          qstashMessageId: messageId.messageId,
          scheduledAt:     fireAt,
          status:          "PENDING",
        },
      })
    );
  }
}

/**
 * Cancel all pending Sleep Money jobs for a gallery
 * (called when FULL_SALE status is reached).
 */
export async function cancelSleepMoneyDrip(galleryId: string): Promise<void> {
  const { db } = await import("@/lib/db/prisma");

  const jobs = await db.sleepMoneyJob.findMany({
    where: { galleryId, status: "PENDING" },
  });

  for (const job of jobs) {
    if (job.qstashMessageId) {
      try {
        await qstash.messages.delete(job.qstashMessageId);
      } catch {
        // Message may already have fired — ignore
      }
    }
  }

  await db.sleepMoneyJob.updateMany({
    where: { galleryId, status: "PENDING" },
    data:  { status: "SUCCESS" }, // mark as cancelled/complete
  });
}
