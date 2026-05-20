var mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  monitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Monitor' },
  websiteName: { type: String },
  action: { type: String, enum: ['added', 'deleted', 'activated', 'deactivated', 'notification_sent'], required: true },
  description: { type: String },
  details: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model("activities", ActivitySchema);
