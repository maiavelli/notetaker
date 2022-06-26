// dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const database = require('./db/db');

// set up express app
const PORT = process.env.PORT || 3001;
const app = express();

// link to assets
app.use(express.static('public'));

//set up data parsing 
app.use(express.json());
app.use(express.urlencoded({extended: true}));



// on page load, get homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// get notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// get and post functions for notes page
app.route('/api/notes')
    // get the notes list
    .get(function (req, res) {
        res.json(database);
    })

    //add new notes to json file
    .post(function (req, res) {
        let jsonPath = path.join(__dirname, '/db/db.json');
        const newNote = req.body;
        database.push(newNote)
        fs.writeFile(jsonPath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log('Your note was saved!');
        });
        res.json(newNote);
    });

app.delete('/api/notes/:id', (req, res) => {
    const noteID = req.params.id;

    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {

        if (err) throw err;

        const notes = JSON.parse(data);
        const notesArr = notes.filter( item => {
            return item.id !==  noteID
        });

        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err, data) => {
            if (err) throw err;
            res.json(notesArr)
        });
    });
});

// listen for port and console log once it's started
app.listen(PORT, function(){
    console.log('app listening on PORT: ' + PORT)
});