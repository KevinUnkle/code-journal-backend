/* eslint-disable no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import ClientError from './lib/client-error.js';
import errorMiddleware from './lib/error-middleware.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "entries"
        order by "entryId"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/entries', async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    if (!title || !notes || !photoUrl) {
      throw new ClientError(400, 'title, notes, photo URL required');
    }
    const sql = `
      insert into "entries" ("title", "notes", "photoUrl")
        values ($1, $2, $3)
        returning *
    `;
    const params = [title, notes, photoUrl];
    const result = await db.query(sql, params);
    const [entry] = result.rows;
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});
