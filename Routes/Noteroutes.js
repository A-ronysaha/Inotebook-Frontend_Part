let express = require("express");
let router = express.Router();
let Note = require("../Schema/Note");
const { body, validationResult } = require("express-validator");
let Fetchuser = require("../Middleware/Fetchuser");

// Route 1.. ** Get all the Notes using: GET "api/notes/fetchallnotes" , login required ** //

router.get("/fetchallnotes", Fetchuser, async (req, res) => {
  try {
    let allFetchNotes = await Note.find({ user: req.user.id });
    res.json(allFetchNotes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Invalid login credential");
  }
});

// Route 2.. ** Add new Notes using: POST "api/notes/addnotes" , login required ** //

router.post(
  "/addnote",
  Fetchuser,
  [
    body("title").isLength({ min: 5 }),
    body("description").isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // express_validation error check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const theNote = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await theNote.save();
     // console.log(saveNote);
      res.json({ saveNote });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Invalid login credential");
    }
  }
);

// Route 3.. ** UPDATE Notes using: PUT "api/notes/updatenotes" , login required ** //

router.post("/updatenote/:id", Fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // create a update note object & set the keys
    const updatedNote = {};
    if (title) {
      updatedNote.title = title;
    }
    if (description) {
      updatedNote.description = description;
    }
    if (tag) {
      updatedNote.tag = tag;
    }

    // find that note which will update
   
    let thatNote = await Note.findById(req.params.id);
   // console.log(thatNote);
    if (!thatNote) {
      return res.status(404).send("Not Found that note");
    }
    //  that user who wants to update
    if (thatNote.user.toString() !== req.user.id) {
      return res.status(401).send("Not Match with userId");
    }
    thatNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updatedNote },
      {
        runValidators: true,
        new: true,
      }
    );
    res.json({ thatNote });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Invalid login credential");
  }
});

// Route 4.. ** DELETE Notes using: DELETE: "api/notes/deletenotes" , login required ** //

router.delete("/deletenote/:id", Fetchuser, async (req, res) => {
  try {
    //Find that note to be deleted
    let dltNote = await Note.findById(req.params.id);
    console.log(dltNote);
    if (!dltNote) {
      return res.status(404).send("Not Found that note");
    }
    //Alow delete only if user owns this note
    if (dltNote.user.toString() !== req.user.id) {
      return res.status(401).send("Not Match with userId");
    }

    dltNote = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Your Note has been deleted", Delete: dltNote });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Invalid login credential");
  }
});
module.exports = router;
