const router = require("express").Router();
const db = require("../db");

/**
 * GET all products
 */
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM warehouses ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADD product
 */
router.post("/", async (req, res) => {
  try {
    const { name, location } = req.body;

    const result = await db.query(
      `INSERT INTO warehouses (name, location)
       VALUES ($1, $2) RETURNING *`,
      [name, location]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * UPDATE product
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, location } = req.body;

    const result = await db.query(
      `UPDATE warehouses
       SET name=$1, location=$2
       WHERE id=$3 RETURNING *`,
      [name, location, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE product
 */
router.delete("/:id", async (req, res) => {
  const warehouseId = req.params.id;

  try {
    // delete dependent records first
    await db.query(
      "DELETE FROM inventory WHERE warehouse_id = $1",
      [warehouseId]
    );

    await db.query(
      "DELETE FROM alerts WHERE warehouse_id = $1",
      [warehouseId]
    );

    // now delete warehouse
    await db.query(
      "DELETE FROM warehouses WHERE id = $1",
      [warehouseId]
    );

    res.json({ message: "Warehouse deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;


