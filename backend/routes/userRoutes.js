const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

// Get logged user plan
router.get("/dashboard", auth, async (req, res) => {
    res.json(req.user);
});

module.exports = router;
