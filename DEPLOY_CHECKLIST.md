# PixelHoliday OS Deployment Checklist

## Pre-Deployment

- [ ] All tests passing (`npm test`)
- [ ] No console errors in dev (`npm run dev`)
- [ ] Database migrations up-to-date (`npx prisma migrate deploy`)
- [ ] Environment variables set in Cloudflare Pages
- [ ] Stripe keys configured (test or live)
- [ ] Upstash Redis connection tested
- [ ] Resend email service verified
- [ ] OpenAI API access confirmed

## Deployment Steps

1. **Build Check**: `npm run build`
2. **Database**: `npx prisma migrate deploy`
3. **Deploy**: `./deploy.sh`
4. **Verify**: Check deployment logs in Cloudflare dashboard

## Post-Deployment

- [ ] Site loads without errors
- [ ] Authentication works (test login)
- [ ] Database queries working
- [ ] Payment flow tested (use Stripe test card)
- [ ] Email notifications sent
- [ ] Analytics tracking active
- [ ] SSL certificate verified

## Rollback Procedure

1. Revert to previous GitHub commit
2. Run `./deploy.sh` to redeploy previous version
3. Verify site stability

## Monitoring

- Set up Sentry for error tracking
- Monitor Cloudflare Analytics
- Check database performance in Neon dashboard
- Review Stripe transaction logs
