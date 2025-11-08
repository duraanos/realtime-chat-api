import admin from 'firebase-admin';

const firebaseCredentials = process.env.FIREBASE_CREDENTIALS;
if (!firebaseCredentials) {
  throw new Error('FIREBASE_CREDENTIALS environment variable is not set');
}

const serviceAccount = JSON.parse(firebaseCredentials) as admin.ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const fcmAdmin = admin;
export const messaging = admin.messaging();
