const {Schema, model} = require('mongoose');

const TaskSchema = new Schema({
  taskname: {
    type: String,
    required: true,
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
}, { timestamps: true })

module.exports = model('Task', TaskSchema);