const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * Get all of the items on the shelf
 */
router.get('/', (req, res) => {
  const queryText = `SELECT * FROM "item"`;
  pool.query(queryText)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error('Error completing SELECT shelf query', err);
      res.sendStatus(500);
    });
});


/**
 * Add an item for the logged in user to the shelf
 */
router.post('/', (req, res) => {
  const { description, image_url } = req.body;
  const queryText = `INSERT INTO "item" (description, image_url, user_id) VALUES ($1, $2, $3) RETURNING *`;
  pool.query(queryText, [description, image_url, req.user.id])
    .then(result => res.status(201).json(result.rows[0]))
    .catch(err => {
      console.error('Error completing INSERT shelf query', err);
      res.sendStatus(500);
    });
});


/**
 * Delete an item if it's something the logged in user added
 */
router.delete('/:id', (req, res) => {
  const itemId = req.params.id;
  const queryText = `DELETE FROM "item" WHERE id=$1 AND user_id=$2`;
  pool.query(queryText, [itemId, req.user.id])
    .then(result => {
      if (result.rowCount > 0) {
        res.sendStatus(204);
      } else {
        res.sendStatus(403); // Forbidden if the user doesn't own the item
      }
    })
    .catch(err => {
      console.error('Error completing DELETE shelf query', err);
      res.sendStatus(500);
    });
});

/**
 * Update an item if it's something the logged in user added
 */
router.put('/:id', (req, res) => {
  // endpoint functionality
});

/**
 * Return all users along with the total number of items
 * they have added to the shelf
 */
router.get('/count', (req, res) => {
  // endpoint functionality
});

/**
 * Return a specific item by id
 */
router.get('/:id', (req, res) => {
  // endpoint functionality
});

module.exports = router;
