// dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const database = require('./db/db');

// import js file that generates random ID for note
const uuid = require('./public/assets/js/uuid');

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

    // add new notes to json file
    .post(function (req, res) {
        const jsonPath = path.join(__dirname, '/db/db.json');
        const newNote = req.body;
        newNote.id = uuid();
        database.push(newNote)
        fs.writeFile(jsonPath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log('your note was saved!');
        });
        res.json(newNote);
    });


// delete notes from json and rewrite file
app.delete('/api/notes/:id', (req, res) => {
    const jsonPath = path.join(__dirname, '/db/db.json');
    const noteID = req.params.id;

    for (let i = 0; i < database.length; i++) {

        if (database[i].id == noteID) {
            // Splice takes i position, and then deletes the 1 note.
            database.splice(i, 1);
            break;
        }
    }
    // Write the db.json file again.
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
        }
    });
    res.json(database);
    });

// listen for port and console log once it's started
app.listen(PORT, function(){
    console.log('app listening on PORT: ' + PORT)
});