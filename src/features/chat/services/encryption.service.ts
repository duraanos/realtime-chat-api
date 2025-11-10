import * as crypto from 'crypto';

const ENCRYPTION_KEY: string | undefined = process.env.CHAT_ENCRYPTION_KEY;
const ALGORITHM: string = 'aes-256-cbc';
const IV_LENGTH: number = 16;

if (!ENCRYPTION_KEY)
  throw new Error('CHAT_ENCRYPTION_KEY environment variable is not set');

export const encryptionService = {
  encrypt(content: string): { iv: string; encryptedData: string } {
    const iv: Buffer = crypto.randomBytes(IV_LENGTH);

    const cipher: crypto.Cipheriv = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'utf-8'),
      iv
    );

    let encrypted: string = cipher.update(content, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted,
    };
  },

  decrypt(encryptedData: string, iv: string): string {
    const dechiper: crypto.Decipheriv = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'utf-8'),
      Buffer.from(iv, 'hex')
    );

    let decrypted: string = dechiper.update(encryptedData, 'hex', 'utf-8');
    decrypted += dechiper.final('utf-8');

    return decrypted;
  },
};
