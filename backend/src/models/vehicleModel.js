import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const { Schema } = mongoose;

const vehicleSchema = new Schema({
  driverId: {
    type: String,
    match: [OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE],
    default: null,
  },
  paymentId: {
    type: String,
    match: [OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE],
    default: null,
  },
  licensePlate: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[0-9]{2}[A-Z]-[0-9]{4,5}$/,
  },
  type: {
    type: String,
    minlength: 2,
    maxlength: 20,
    trim: true,
    default: 'Car',
  },
  active: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

vehicleSchema.plugin(mongoose_delete, { 
  deletedAt: true,
  overrideMethods: 'all',
});


const Vehicle = mongoose.model('Vehicle', vehicleSchema);



export default Vehicle