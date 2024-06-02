const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

let users = [];

// Load existing users from users.json
const usersFilePath = path.join(__dirname, 'users.json');
if (fs.existsSync(usersFilePath)) {
    users = JSON.parse(fs.readFileSync(usersFilePath));
}

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.json({ success: false, message: 'Username already exists' });
    }
    users.push({ username, password, results: [] });
    fs.writeFileSync(usersFilePath, JSON.stringify(users));
    res.json({ success: true });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ success: true, results: user.results });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
});

// Save result endpoint
app.post('/save-result', (req, res) => {
    const { username, result } = req.body;
    const user = users.find(user => user.username === username);
    if (user) {
        user.results.push(result);
        fs.writeFileSync(usersFilePath, JSON.stringify(users));
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
