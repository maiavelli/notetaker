// dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const database = require('./db/db');

// set up express app
const PORT = process.env.PORT || 3001;
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.listen(PORT, function(){
    console.log('app listening on PORT: ' + PORT)
});

// get homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// get notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// render existing notes to page
app.get('/api/notes', (req, res) => {
    res.json(database);
});

// post method to add new notes
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
        const newNote = req.body;

        res.json(newNote);

        if (err) throw err;
    });
});
    
