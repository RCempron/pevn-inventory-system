require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

function validateItem(req, res, next) {
  const { name, quantity, price } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Item name is required' });
  }
  if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be a number 0 or greater' });
  }
  if (price === undefined || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price must be a number greater than 0' });
  }

  next();
}

app.get('/', (req, res) => {
  res.send('Hello Ron! Your server is alive.');
});

app.get('/test', (req, res) => {
  res.json({ message: 'This is a test endpoint', status: 'working' });
});

app.get('/greet/:name', (req, res) => {
  const userName = req.params.name;
  res.json({ greeting: `Hello, ${userName}! Welcome to your API.` });
});

app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/items', verifyToken, validateItem, async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const result = await pool.query(
      'INSERT INTO items (name, quantity, price) VALUES ($1, $2, $3) RETURNING *',
      [name, quantity, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.put('/items/:id', verifyToken, validateItem, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, price } = req.body;
    const result = await pool.query(
      'UPDATE items SET name = $1, quantity = $2, price = $3 WHERE id = $4 RETURNING *',
      [name, quantity, price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.delete('/items/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM items WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted', deletedItem: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/sales', verifyToken, async (req, res) => {
  try {
    const { item_id, quantity_sold } = req.body;

    if (!item_id || !quantity_sold || quantity_sold <= 0) {
      return res.status(400).json({ error: 'Valid item_id and quantity_sold are required' });
    }

    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [item_id]);
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = itemResult.rows[0];

    if (quantity_sold > item.quantity) {
      return res.status(400).json({
        error: `Cannot sell ${quantity_sold} units. Only ${item.quantity} in stock.`
      });
    }

    const updatedItem = await pool.query(
      'UPDATE items SET quantity = quantity - $1 WHERE id = $2 RETURNING *',
      [quantity_sold, item_id]
    );

    const sale = await pool.query(
      `INSERT INTO sales_log (item_id, item_name, quantity_sold, price_at_sale)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [item_id, item.name, quantity_sold, item.price]
    );

    res.status(201).json({
      sale: sale.rows[0],
      updatedItem: updatedItem.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}); 

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`On your network: http://192.168.254.106:${PORT}`);
});