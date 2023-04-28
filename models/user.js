const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://w-dog.ru/wallpapers/9/14/461388963092987/gora-moran-snejk-river-grand-teton-nacionalnyj-park-vajoming-reka-snejk-grand-titon-otrazhenie.jpg',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    select: false,
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  //находим пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      //если user не нашли, то промис отклоняем
      if (!user) {
        return Promise.reject(new Error('Неправильная почта'));
      }
      //если email Нашли, то сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильный пароль'));
          }

          return user;
        })
    })
}

module.exports = mongoose.model('user', userSchema);

