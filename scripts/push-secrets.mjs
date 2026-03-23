import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function pushSecrets() {
  console.log('Pushing secrets to Cloudflare...');
  
  const secrets = [
    'AUTH_SECRET',
    'STRIPE_SECRET_KEY',
    'UPSTASH_REDIS_REST_TOKEN',
    'RESEND_API_KEY',
    'OPENAI_API_KEY'
  ];
  
  for (const secret of secrets) {
    const value = process.env[secret];
    if (!value) {
      console.warn(`Warning: ${secret} not set`);
      continue;
    }
    
    try {
      await execAsync(`wrangler secret put ${secret} --path . `);
      console.log(`✓ ${secret} pushed`);
    } catch (error) {
      console.error(`✗ Failed to push ${secret}`, error.message);
    }
  }
}

pushSecrets().catch(console.error);
