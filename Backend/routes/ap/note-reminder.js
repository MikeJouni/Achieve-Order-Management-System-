var express = require('express');
var router = express.Router();
const noteReminderController = require('../../controllers/ap/note-reminder');


//  Routes & Functions

router.post("/create", noteReminderController.createNoteReminder);
router.patch("/update", noteReminderController.updateNoteReminder);
router.delete("/delete/:noteReminderId", noteReminderController.deleteNoteReminder);
router.get("/get-one/:noteReminderId", noteReminderController.getOneNoteReminder);
router.get("/get-all", noteReminderController.getAllNoteReminders);
router.get("/get-by-company/:companyId", noteReminderController.getNoteRemindersByCompany);


module.exports = router;
