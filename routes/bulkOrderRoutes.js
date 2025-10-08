const express = require('express');
const {
    createBulkOrder,
    getBulkOrderById,
    getUserBulkOrders,
    getAllBulkOrders,
    updateBulkOrderStatus
} = require("../controllers/bulkOrderController.js");
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ----------------- USER ROUTES -----------------
router.post("/", protect, createBulkOrder);               // POST /api/bulk-orders
router.get("/:id", protect, getBulkOrderById);            // GET /api/bulk-orders/:id
router.get("/user/:userId", protect, getUserBulkOrders);  // GET /api/bulk-orders/user/:userId

// ----------------- ADMIN ROUTES -----------------
router.get("/admin/all", protect, getAllBulkOrders);            // GET /api/bulk-orders/admin/all
router.patch("/admin/:id/status", protect, updateBulkOrderStatus); // PATCH /api/bulk-orders/admin/:id/status

module.exports = router;
