// JWT Authentication API

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

app.use(express.json());

const SECRET_KEY = "my_secret_key";

const users = [
    {
        id: 1,
        username: "harsh",
        password: "12345"
    }
];

// Generate JWT
function createToken(user) {
    return jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        SECRET_KEY,
        {
            expiresIn: "1h"
        }
    );
}

// Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        user =>
            user.username === username &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const token = createToken(user);

    console.log("JWT Token:", token);

    res.json({
        message: "Login successful",
        token: token
    });
});

// Authentication Middleware
function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    jwt.verify(token, SECRET_KEY, (error, user) => {

        if (error) {
            return res.status(403).json({
                message: "Invalid or expired token"
            });
        }

        req.user = user;

        next();
    });
}

// Protected Profile Route
app.get("/profile", authenticateToken, (req, res) => {

    res.json({
        message: "Welcome to your profile",
        user: req.user
    });
});

// Home
app.get("/", (req, res) => {
    res.send("JWT Authentication API is running");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
