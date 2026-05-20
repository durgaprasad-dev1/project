var mongoose = require("mongoose");

const MonitorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  frequency: { type: String, enum: ['hourly', 'daily', 'weekly'], default: 'daily' },
  keyword: { type: String },
  isActive: { type: Boolean, default: true },
  notifications: {
    type: [
      {
        sentAt: { type: Date, default: Date.now },
        message: { type: String, required: true },
        keyword: { type: String },
        url: { type: String },
        emailTo: { type: String },
        emailSubject: { type: String }
      }
    ],
    default: []
  }
}, { timestamps: true }); // Automatically manages createdAt and updatedAt


module.exports = mongoose.model(
    "monitors",
    MonitorSchema
);