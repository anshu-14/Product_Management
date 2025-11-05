import db from "../../config/db.js";
import { exportData } from "../../utils/exporter.js";

export const addProduct = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, categoryId, price, isActive = 1 } = req.body;

    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    if (categoryId == null) return res.status(400).json({ message: "CategoryId is required" });
    if (price == null || isNaN(price)) return res.status(400).json({ message: "Valid price is required" });

    const [cat] = await db.query(
      `SELECT CategoryId FROM categories WHERE CategoryId = ? AND IsDeleted = 0`,
      [categoryId]
    );
    if (!cat.length) return res.status(400).json({ message: "Invalid CategoryId" });

    const [dupe] = await db.query(
      `SELECT 1 FROM products WHERE Name = ? AND IsDeleted = 0 LIMIT 1`,
      [name.trim()]
    );
    if (dupe.length) return res.status(409).json({ message: "Product name already exists" });

    const [result] = await db.query(
      `INSERT INTO products (Name, CategoryId, Price, IsActive, IsDeleted, CreatedBy)
       VALUES (?, ?, ?, ?, 0, ?)`,
      [name.trim(), categoryId, Number(price), isActive ? 1 : 0, userId]
    );

    res.status(201).json({ message: "Product created", productId: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Product name already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { name, categoryId, price, isActive } = req.body;


    const [exists] = await db.query(
      `SELECT ProductId FROM products WHERE ProductId = ? AND IsDeleted = 0`,
      [id]
    );
    if (!exists.length) return res.status(404).json({ message: "Product not found" });

    // if name provided, enforce uniqueness
    if (name !== undefined) {
      const [dupes] = await db.query(
        `SELECT 1 FROM products WHERE Name = ? AND IsDeleted = 0 AND ProductId <> ? LIMIT 1`,
        [name, id]
      );
      if (dupes.length) return res.status(409).json({ message: "Product name already exists" });
    }


    if (categoryId !== undefined) {
      const [cat] = await db.query(
        `SELECT CategoryId FROM categories WHERE CategoryId = ? AND IsDeleted = 0`,
        [categoryId]
      );
      if (!cat.length) return res.status(400).json({ message: "Invalid CategoryId" });
    }

    const fields = [];
    const params = [];

    if (name !== undefined) { fields.push("Name = ?"); params.push(name); }
    if (categoryId !== undefined) { fields.push("CategoryId = ?"); params.push(categoryId); }
    if (price !== undefined) {
      if (price === null || isNaN(price)) return res.status(400).json({ message: "Valid price is required" });
      fields.push("Price = ?"); params.push(Number(price));
    }
    if (isActive !== undefined) { fields.push("IsActive = ?"); params.push(isActive ? 1 : 0); }

    fields.push("ModifiedBy = ?");
    params.push(userId);
    fields.push("ModifiedAt = NOW()");

    if (fields.length === 0) return res.status(400).json({ message: "No fields to update" });

    params.push(id);

    const [result] = await db.query(
      `UPDATE products SET ${fields.join(", ")} WHERE ProductId = ? AND IsDeleted = 0`,
      params
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Product name already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE products
         SET IsDeleted = 1, ModifiedBy = ?, ModifiedAt = NOW()
       WHERE ProductId = ? AND IsDeleted = 0`,
      [userId, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




export const toggleActiveProduct = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT IsActive FROM products WHERE ProductId = ? AND IsDeleted = 0`,
      [id]
    );
    const row = rows[0];
    if (!row) return res.status(404).json({ message: "Product not found" });

    const next = row.IsActive ? 0 : 1;

    const [result] = await db.query(
      `UPDATE products
         SET IsActive = ?, ModifiedBy = ?, ModifiedAt = NOW()
       WHERE ProductId = ? AND IsDeleted = 0`,
      [next, userId, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product status toggled", isActive: !!next });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT
         p.ProductId,
         p.Name,
         p.CategoryId,
         c.Name AS CategoryName,
         p.Price,
         p.IsActive,
         p.IsDeleted,
         p.CreatedBy,
         cu.UserName AS CreatedByName,
         p.CreatedAt,
         p.ModifiedBy,
         mu.UserName AS ModifiedByName,
         p.ModifiedAt
       FROM products p
       LEFT JOIN categories c ON c.CategoryId = p.CategoryId
       LEFT JOIN users cu ON cu.UserId = p.CreatedBy
       LEFT JOIN users mu ON mu.UserId = p.ModifiedBy
       WHERE p.ProductId = ? AND p.IsDeleted = 0`,
      [id]
    );

    const row = rows[0];
    if (!row) return res.status(404).json({ message: "Product not found" });

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const {
      search = "",
      orderBy = "ProductId",
      orderDir = "ASC",
      page = 1,
      pageSize = 10,
    } = req.query;

    const isExport = String(req.query.isExport || "").toLowerCase() === "true";
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const sizeNum = Math.max(parseInt(pageSize, 10) || 10, 1);

    let isActiveParam = null;
    if (typeof isActive !== "undefined" && isActive !== "") {
      const val = String(isActive).toLowerCase();
      isActiveParam =
        val === "true" || val === "1"
          ? 1
          : val === "false" || val === "0"
          ? 0
          : null;
    }

    const params = [
      search || null,
      isActiveParam,
      orderBy || "ProductId",
      orderDir || "ASC",
      pageNum,
      sizeNum,
      isExport ? 1 : 0,
    ];

    const [resultSets] = await db.query(
      "CALL sp_get_productsV2(?, ?, ?, ?, ?, ?,?)",
      params
    );

    const data = resultSets[0] || [];
    const total = resultSets[1]?.[0]?.total ?? 0;
    if (!isExport) {
      return res.json({
        data,
        page: pageNum,
        pageSize: sizeNum,
        total,
        totalPages: Math.ceil(total / sizeNum),
        orderBy,
        orderDir: orderDir?.toUpperCase() === "DESC" ? "DESC" : "ASC",
        filters: {
          search: search || "",
          isActive: isActiveParam,
        },
      });
    }
    const selectedKeys = ["Name", "CategoryName", "CreatedByName", "CreatedAt"];
    return exportData(data, "Product", res, selectedKeys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
