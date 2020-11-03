const { Schema, model } = require('mongoose');

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{timestamps: true}
)

module.exports = model('Project', ProjectSchema)