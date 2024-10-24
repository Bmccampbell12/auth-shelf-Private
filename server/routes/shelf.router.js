const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware')

/**
 * Get all of the items on the shelf
 */

// This route *should* return the logged in users items

router.get('/', (req, res) => {
    console.log('/shelf GET route');
    console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);

    const queryText = `
    SELECT * FROM "items"
    WHERE user_id = $1;
  `
  
  if (req.isAuthenticated() && req.user.access_level == 0) { // ! This is needed if you want to use req.user (because if user isnt authenticated then req.user will be undefined.)
    pool.query(queryText, [req.user.id]).then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
} else {
    console.log("Forbidden User")
    res.sendStatus(403)
}

});


/**
 * Add an item for the logged in user to the shelf
 */

// This route *should* add a pet for the logged in user

router.post("/", rejectUnauthenticated, (req, res) => {
  console.log('item being added is:', req.body, 'with user:', req.user.id)
const query = `
INSERT INTO "item"
  ("description", "image_url", "user_id")
  VALUES
  ($1, $2, $3)
`
const sqlValues = [req.body.description, req.body.image_url, req.user.id]

pool.query(query, sqlValues)
.then (result => {
  res.sendStatus(200)
})
.catch(error => {
  console.log('Server error posting item:', error)
  res.sendStatus(500)
})
});

/**
 * Delete an item if it's something the logged in user added
 */
router.delete("/:id", rejectUnauthenticated, (req, res) => {
  const sqlText = `DELETE FROM "item"
    WHERE "id" = $1`;
  const sqlValues = [req.params.id];
  pool
    .query(sqlText, sqlValues)
    .then((dbRes) => res.sendStatus(200))
    .catch((dbErr) => {
      console.log(`SQL Error in DELETE/api/shelf`, dbErr);
   res.sendStatus(403); // Forbidden if the user doesn't own the item
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
