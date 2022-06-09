const express = require("express");
const fetchuser = require('../middileware/fetchuser.js');
const { body, validationResult } = require('express-validator');
const Notes = require("../model/notes");
const router = express.Router();
// router 1 fetchnotes for user

router.get("/fetchnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.send(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// router 2 createnotes for user
router.post("/createnotes", fetchuser, [
    body("title", "plases enter title").isLength({ min: 1 }),
    body("description", "plases enter description").isLength({ min: 1 }),
    body("tag", "plases enter metatitle").isLength({ min: 1 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // error message sent
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const notes = new Notes({
            tag, title, description, user: req.user.id
        });
        const saveNotes = await notes.save();
        res.send(saveNotes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }


})

// router 3 updatenotes for user

router.put("/updatenode/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
})

// router 4 deletenotes for user

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        const note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }

        let Note = await Notes.findByIdAndDelete(req.params.id);
        res.send(Note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;