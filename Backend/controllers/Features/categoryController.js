import db from "../../config/db.js";
import { exportData } from "../../utils/exporter.js";
export const addCategory = async (req, res) => {
  try {
    
    const { Name, Description = null } = req.body;
    const userId = req.user?.id;
    if (!Name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const [exists] = await db.query(
      `SELECT 1 FROM categories WHERE Name = ? AND IsDeleted = 0 LIMIT 1`,
      [Name.trim()]
    );
    if (exists.length) {
      return res.status(409).json({ message: "Category name already exists" });
    }

    const [result] = await db.query(
      `INSERT INTO categories (Name, Description, IsActive, IsDeleted, CreatedBy)
       VALUES (?, ?, 1, 0, ?)`,
      [Name.trim(), Description, userId]
    );

    res
      .status(201)
      .json({ message: "Category created", categoryId: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Category name already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Description } = req.body;
    const userId = req.user?.id;

    const [rows] = await db.query(
      `SELECT CategoryId FROM categories WHERE CategoryId = ? AND IsDeleted = 0`,
      [id]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Category not found" });

    if (Name !== undefined) {
      const [dupes] = await db.query(
        `SELECT 1 FROM categories 
         WHERE Name = ? AND IsDeleted = 0 AND CategoryId <> ? LIMIT 1`,
        [Name, id]
      );
      if (dupes.length)
        return res
          .status(409)
          .json({ message: "Category name already exists" });
    }
    const fields = [];
    const params = [];

    if (Name !== undefined) {
      fields.push("Name = ?");
      params.push(Name);
    }
    if (Description !== undefined) {
      fields.push("Description = ?");
      params.push(Description);
    }
    // if (isActive !== undefined) {
    //   fields.push("IsActive = ?");
    //   params.push(isActive ? 1 : 0);
    // }

    fields.push("ModifiedBy = ?");
    params.push(userId);
    fields.push("ModifiedAt = NOW()");

    if (fields.length === 0)
      return res.status(400).json({ message: "No fields to update" });

    params.push(id);

    const [result] = await db.query(
      `UPDATE categories SET ${fields.join(
        ", "
      )} WHERE CategoryId = ? AND IsDeleted = 0`,
      params
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Category name already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const [result] = await db.query(
      `UPDATE categories 
         SET IsDeleted = 1, ModifiedBy = ?, ModifiedAt = NOW()
       WHERE CategoryId = ? AND IsDeleted = 0`,
      [userId, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const [rows] = await db.query(
      `SELECT IsActive FROM categories WHERE CategoryId = ? AND IsDeleted = 0`,
      [id]
    );
    const row = rows[0];
    if (!row) return res.status(404).json({ message: "Category not found" });

    const next = row.IsActive ? 0 : 1;

    const [result] = await db.query(
      `UPDATE categories 
         SET IsActive = ?, ModifiedBy = ?, ModifiedAt = NOW()
       WHERE CategoryId = ? AND IsDeleted = 0`,
      [next, userId, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category status updated", isActive: !!next });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT CategoryId, Name, Description, IsActive, IsDeleted, CreatedBy, CreatedAt, ModifiedBy, ModifiedAt
       FROM categories
       WHERE CategoryId = ? AND IsDeleted = 0`,
      [id]
    );

    const row = rows[0];
    if (!row) return res.status(404).json({ message: "Category not found" });

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const {
      search = "",
      orderBy = "CategoryId",
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
      orderBy || "CategoryId",
      orderDir || "ASC",
      pageNum,
      sizeNum,
      isExport ? 1 : 0,
    ];

    const [resultSets] = await db.query(
      "CALL sp_get_categories(?, ?, ?, ?, ?, ?,?)",
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
    const selectedKeys = ["Name", "Description", "CreatedByName", "CreatedAt"];
    return exportData(data, "Categories", res, selectedKeys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
