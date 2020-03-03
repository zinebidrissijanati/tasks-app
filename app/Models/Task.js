const db = use('MongoDB');

const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSchema = new Schema({
    title: {type: String, required: true},
    date: {type: Date, required: true},
    description: {type: String},
    sequenceNumber: {type: Number, required:true},
    createdBy: {
        type: String, required: true,
      },
    createdAt: { type: Date, required: true },
});
const Tasks = db.model("Tasks", taskSchema);
module.exports = Tasks;
