const express = require("express");
const router = express.Router();
const db = require("../db");
const Inventory = require("../models/inventoryModel");
const LowStockService = require("../services/lowStockService");
const { upsertStock } = require("../services/inventoryService");

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        i.id,
        p.name AS product_name,
        p.sku,
        w.name AS warehouse,
        i.quantity,
        p.reorder_level
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      ORDER BY p.name
    `);


    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const result = await db.query(
      `
      UPDATE inventory
      SET quantity = $1
      WHERE id = $2
      RETURNING *
      `,
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inventory record not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM inventory
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inventory record not found" });
    }

    res.json({ message: "Inventory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/upsert", async (req, res) => {
  try {
    const result = await upsertStock(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





router.post("/", async (req, res) => {
  try {
    const record = await Inventory.upsertStock(req.body);
    await LowStockService.checkLowStock(); // 🔔 trigger alert
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
