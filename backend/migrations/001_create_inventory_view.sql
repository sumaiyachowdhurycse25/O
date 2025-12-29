CREATE VIEW inventory_view AS
SELECT
  i.id AS inventory_id,
  p.id AS product_id,
  p.name AS product_name,
  p.sku,
  w.id AS warehouse_id,
  w.name AS warehouse_name,
  i.quantity,
  p.reorder_level
FROM inventory i
JOIN products p ON p.id = i.product_id
JOIN warehouses w ON w.id = i.warehouse_id;

