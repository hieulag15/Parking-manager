import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 50, trim: true },
  address: { type: String, maxlength: 50, trim: true, default: '' },
  phone: { type: String, required: true, minlength: 10, maxlength: 11, trim: true, unique: true },
  email: { type: String, required: true, minlength: 4, maxlength: 200, trim: true, unique: true },
  gender: { type: String, minlength: 1, maxlength: 20, trim: true },
  avatar: { type: String, maxlength: 50, trim: true, default: '' },
  account: {
    username: { type: String, required: true, minlength: 4, maxlength: 30, trim: true },
    password: { type: String, required: true, minlength: 20, maxlength: 100, trim: true },
    role: { type: String, required: true, minlength: 3, maxlength: 20, trim: true },
  },
  driver: {
    arrayvehicleId: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    job: { type: String, required: true, minlength: 4, maxlength: 50, trim: true },
    department: { type: String, required: true, minlength: 1, maxlength: 50, trim: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  _destroy: { type: Boolean, default: false },
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;