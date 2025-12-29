const router = require("express").Router();
const db = require("../db");

/* Inventory summary */
router.get("/inventory", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM inventory_view
      ORDER BY product_name
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Low stock cards */
router.get("/low-stock", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM inventory_view
      WHERE quantity <= reorder_level
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

