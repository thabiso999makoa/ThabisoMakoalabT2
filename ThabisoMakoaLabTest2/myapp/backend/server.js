// server.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// OMDB API Base URL
const OMDB_API_URL = 'http://www.omdbapi.com/';

// GET /movies?title=...
app.get('/movies', async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const response = await fetch(`${OMDB_API_URL}?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(title)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// GET /movie/:id
app.get('/movie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${OMDB_API_URL}?apikey=${process.env.OMDB_API_KEY}&i=${id}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

// GET /reviews
app.get('/reviews', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /reviews
app.post('/reviews', async (req, res) => {
  const { movieId, movieTitle, rating, reviewText, userName } = req.body;
  if (!movieId || !movieTitle || !rating || !reviewText || !userName) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const newReview = {
      movieId,
      movieTitle,
      rating: parseInt(rating),
      reviewText,
      userName,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('reviews').add(newReview);
    res.status(201).json({ id: docRef.id, ...newReview });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save review' });
  }
});

// PUT /reviews/:id
app.put('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const { rating, reviewText } = req.body;

  try {
    await db.collection('reviews').doc(id).update({
      rating: parseInt(rating),
      reviewText,
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE /reviews/:id
app.delete('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('reviews').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});