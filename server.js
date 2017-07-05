const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const Comic = require('./models/comic.js');
var qs = require('qs');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/ComicsApplication');

var application = express();

application.engine('handlebars', expressHandlebars());
application.set('view engine', 'handlebars');

application.use(bodyParser.urlencoded());

application.use('/public', express.static('./public'));

async function getComics() {
    var comic = await Comic.find();
    return comic
}

application.get('/', (request, response) => {
    response.redirect('/index');
});

application.get('/index', async (request, response) => {
    var comicList = await getComics();
    var model = { comics: comicList };
    response.render('index', model);
});

application.post('/index', async (request, response) => {
    var name = request.body.name;
    var hero = request.body.hero;
    var villain = request.body.villain;
    var writers = request.body.writers;
    var pages = request.body.pages;

    var create = await Comic.create({
        name: name,
        characters: { hero: hero, villain: villain },
        writers: writers.split(","),
        pages: parseInt(pages)
    });

    response.redirect('/index');
});

application.post('/index/update/:id', async (request, response) => {
    var name = request.body.name;
    var hero = request.body.hero;
    var villain = request.body.villain;
    var writers = request.body.writers;
    var pages = request.body.pages;
    var comicId = request.params.id;
    var removeComic = await Comic.updateOne({ _id: comicId },
        {
            name: name,
            characters: { hero: hero, villain: villain },
            writers: writers.split(","),
            pages: parseInt(pages)
        });

    response.redirect('/index/');
});

application.post('/index/delete/:id', async (request, response) => {
    var comicId = request.params.id;
    var removeComic = await Comic.deleteOne({ _id: comicId });

    response.redirect('/index/');
});

application.listen(3000);