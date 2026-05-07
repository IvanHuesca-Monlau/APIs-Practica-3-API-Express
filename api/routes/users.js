const express = require('express');
const router = express.Router();
const db = require('../config');

// Endpoint for getting all users
router.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("An error occurred while fetching users:", err);
      res.status(500).json({ error: "An error occurred while fetching users" });
    } else {
      res.json({ users: results });
    }
  });
});

// Endpoint for getting a user by their ID
router.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("An error occurred while fetching the user:", err);
      res.status(500).json({ error: "An error occurred while fetching the user" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.json({ user: results[0] });
      }
    }
  });
});

// Endpoint for creating a new user
router.post("/api/users", (req, res) => {
  const newUser = req.body;
  db.query(
    "INSERT INTO users (first_name, last_name, username, email) VALUES (?, ?, ?, ?)",
    [newUser.first_name, newUser.last_name, newUser.username, newUser.email],
    (err, results) => {
      if (err) {
        console.error("An error occurred while creating the user:", err);
        res.status(500).json({ error: "An error occurred while creating the user" });
      } else {
        res.json({ message: "User created successfully", user: newUser });
      }
    },
  );
});

// Endpoint for updating a user by their ID
router.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  db.query(
    "UPDATE users SET first_name = ?, last_name = ?, username = ?, email = ? WHERE id = ?",
    [updatedUser.first_name, updatedUser.last_name, updatedUser.username, updatedUser.email, userId],
    (err, results) => {
      if (err) {
        console.error("An error occurred while updating the user:", err);
        res.status(500).json({ error: "An error occurred while updating the user" });
      } else {
        res.json({
          message: "User updated successfully",
          user: updatedUser,
        });
      }
    },
  );
});

// Endpoint for deleting a user by their ID
router.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("An error occurred while deleting the user:", err);
      res.status(500).json({ error: "An error occurred while deleting the user" });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});

module.exports = router;
