const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const router = require('./router');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {}); //643c736cd1059ce3382b32f3

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// Здесь роутинг

app.use((req, res, next) => {
  req.user = {
    _id: '643c736cd1059ce3382b32f3'
  };

  next();
});

app.use('/', require('./routes/cards'))
app.use('/', require('./routes/users'));
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' })
})


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})