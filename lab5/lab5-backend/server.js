const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

const FIREBASE_CONFIG_ERROR_MESSAGE = 'Сервер Firebase тимчасово недоступний: невалідний service account ключ. Згенеруйте новий ключ у Firebase Console і оновіть serviceAccountKey.json.';

const isFirebaseCredentialError = (error) => {
  const message = (error && error.message ? error.message : '').toLowerCase();
  return (
    message.includes('unauthenticated') ||
    message.includes('invalid jwt signature') ||
    message.includes('invalid_grant') ||
    message.includes('request had invalid authentication credentials')
  );
};

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Токен відсутній.' });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Невалідний токен.' });
  }
};

app.get('/api/protected', verifyFirebaseToken, (req, res) => {
  res.json({ message: 'Доступ дозволено', uid: req.user.uid, email: req.user.email || null });
});

app.post('/api/orders', verifyFirebaseToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.user.uid;
    const email = req.user.email || null;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Неможливо оформити замовлення: кошик порожній." });
    }

    const newOrder = {
      userId,
      email: email || null,
      items,
      total: Number(total) || 0,
      date: new Date().toISOString()
    };

    await db.collection('orders').add(newOrder);
    res.status(201).json({ message: "Замовлення успішно збережено!" });
  } catch (error) {
    if (isFirebaseCredentialError(error)) {
      return res.status(503).json({ error: FIREBASE_CONFIG_ERROR_MESSAGE });
    }

    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:userId', verifyFirebaseToken, async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const userId = req.user.uid;

    if (requestedUserId !== userId) {
      return res.status(403).json({ error: 'Доступ до чужих замовлень заборонено.' });
    }

    const snapshot = await db.collection('orders').where('userId', '==', userId).get();

    let orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(orders);
  } catch (error) {
    if (isFirebaseCredentialError(error)) {
      return res.status(503).json({ error: FIREBASE_CONFIG_ERROR_MESSAGE });
    }

    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
const logFirebaseCredentialHealth = async () => {
  try {
    await admin.app().options.credential.getAccessToken();
    console.log('Firebase service account: OK');
  } catch (error) {
    console.error('Firebase service account: ERROR -', error.message);
    console.error(FIREBASE_CONFIG_ERROR_MESSAGE);
  }
};

app.listen(PORT, async () => {
  console.log(`Сервер працює на порту ${PORT}`);
  await logFirebaseCredentialHealth();
});