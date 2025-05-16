// This is a simple Express.js application that serves a list of users from a JSON file.
// It allows users to add new users and delete existing ones.
let express = require('express');
let fs = require('fs');
let bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (for CSS, etc.)
app.use(express.static('public'));

// Set up EJS
app.set('view engine', 'ejs');

// List users
app.get('/', (req, res) => {
    res.redirect('/users');
});
// Show list of users
app.get('/users', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('api.json', 'utf-8'));
        res.render('listUsers', { users: data.users });
    } catch (error) {
        console.error("Error reading users:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Show form to add user
app.get('/users/new', (req, res) => {
    res.render('addUser');
});

// Add user
app.post('/users', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('api.json', 'utf-8'));
        const users = data.users;
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const newUser = {
            id: newId,
            name: req.body.name,
            age: parseInt(req.body.age)
        };
        users.push(newUser);
        fs.writeFileSync('api.json', JSON.stringify({ users }, null, 4));
        res.redirect('/users');
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Delete user
app.post('/users/delete/:id', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('api.json', 'utf-8'));
        const users = data.users.filter(u => u.id != req.params.id);
        fs.writeFileSync('api.json', JSON.stringify({ users }, null, 4));
        res.redirect('/users');
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
});
// Start the server
app.listen(3000, () => { 
    console.log("Server is running on port 3000");
});