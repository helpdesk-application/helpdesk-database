const express = require("express");
const router = express.Router();
const User = require("../../models/02-users/User");

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user by email (internal use for Auth service)
router.get("/email/:email", async (req, res) => {
    try {
        // Explicitly include password for auth check
        const user = await User.findOne({ email: req.params.email }).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a user
router.post("/", async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;

        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({
            name,
            email,
            password, // Password should be hashed by the caller (backend service) 
            // The model uses ObjectIds for role_id/department_id but frontend sends strings 'Admin', 'IT Support'.
            // For simplicity in this iteration, we might need to adjust the model or mapping.
            // Checking User.js model: role_id and department_id are ObjectIds.
            // But let's check what frontend is sending. 
            // UserManagement.jsx doesn't send role_id/department_id in create, it sends role/department strings?
            // Wait, UserManagement.jsx has NO CREATE FORM implemented yet! It only has a button.
            // So I can't check what it sends.
            // However, the previous mock data had 'role' string and 'department' string.
            // The current User model expects ObjectIds. This is a mismatch.

            // FIX: To make it work quickly without creating Role/Department tables, 
            // I should probably update User model to allow string role/department OR handle it here.
            // Let's modify the User model to accept strings for now or just ignore strict linking.
            // Actually, looking at User.js (Step 303), it has:
            // role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },

            // I should update User.js to simplify it to use Strings for this phase of the project, 
            // matching K.I.S.S principle and current frontend state.
            role: role || 'Customer',
            department: department || 'General'
            // Wait, I can't put 'role' into 'role_id'.
        });

        // START DB FIX
        // I will use a simplified approach: update User model to use string 'role' and 'department' 
        // instead of IDs, to match the frontend and speed up development.

        // But I am in write_to_file for routes/users.js. I should handle the model update separately.
        // For now I will write this assuming the model supports it or I'll fix the model next.

        await user.save();
        res.status(201).json({ message: "User created", user: { id: user._id, email, name, role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user details
router.patch("/:id", async (req, res) => {
    try {
        const { email, role, department, password } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (email) user.email = email;
        if (role) user.role = role;
        if (department) user.department = department;
        if (password) user.password = password;

        await user.save();
        res.json({ message: "User updated", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Change status
router.patch("/:id/status", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.status = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        await user.save();
        res.json({ message: `User status changed to ${user.status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset password (used by admin? or specialized endpoint)
// Backend controller has resetPassword logic. 
// Usually validation happens in backend. DB service just updates.
// But backend hashes password. So DB service just needs to accept 'password' update via general patch or specific one.
// The backend `resetPassword` hashes it. 
// I'll add a specific route for password or just use generic PATCH if I trust the sender.
// Let's add specific route for clarity.
router.patch("/:id/password", async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Backend hashes it, DB just saves it.
        user.password = password;
        await user.save();
        res.json({ message: "Password updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
