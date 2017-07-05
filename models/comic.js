const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    characters: {
        hero: {type: String, required: true},
        villain: {type: String}
    },
    writers: [],
    pages: Number
});

const Comic = mongoose.model('Comic', comicSchema);

module.exports = Comic;