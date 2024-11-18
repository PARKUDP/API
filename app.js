const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
app.use(bodyParser.json());

app.post('/recipes', (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;

  if (!title || !making_time || !serves || !ingredients || !cost) {
    return res.status(200).json({
      message: "Recipe creation failed!",
      required: ["title", "making_time", "serves", "ingredients", "cost"]
    });
  }

  const sql = `INSERT INTO recipes (title, making_time, serves, ingredients, cost)
               VALUES (?, ?, ?, ?, ?)`;
  pool.query(sql, [title, making_time, serves, ingredients, cost], (err, result) => {
    if (err) throw err;

    res.status(200).json({
      message: "Recipe successfully created!",
      recipe: [{ id: result.insertId, title, making_time, serves, ingredients, cost }]
    });
  });
});

app.get('/recipes', (req, res) => {
  const sql = "SELECT * FROM recipes";
  pool.query(sql, (err, results) => {
    if (err) throw err;

    res.status(200).json({ recipes: results });
  });
});

app.get('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM recipes WHERE id = ?";
  pool.query(sql, [id], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(404).json({ message: "No Recipe found" });
    }

    res.status(200).json({
      message: "Recipe details by id",
      recipe: results
    });
  });
});

app.patch('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const { title, making_time, serves, ingredients, cost } = req.body;

  const sql = `UPDATE recipes SET 
                title = COALESCE(?, title),
                making_time = COALESCE(?, making_time),
                serves = COALESCE(?, serves),
                ingredients = COALESCE(?, ingredients),
                cost = COALESCE(?, cost)
               WHERE id = ?`;
  pool.query(sql, [title, making_time, serves, ingredients, cost, id], (err, result) => {
    if (err) throw err;

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No Recipe found" });
    }

    res.status(200).json({ message: "Recipe successfully updated!" });
  });
});

app.delete('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM recipes WHERE id = ?";
  pool.query(sql, [id], (err, result) => {
    if (err) throw err;

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No Recipe found" });
    }

    res.status(200).json({ message: "Recipe successfully removed!" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
