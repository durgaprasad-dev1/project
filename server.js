var express = require('express');
var cors = require('cors');
var path = require('path');

require('./database/connection');

const authRoutes = require('./routes/auth');
const monitorRoutes = require('./routes/monitor');
const avatarRoutes = require('./routes/avatar');
const { startMonitoring } = require('./workers/monitoring');
const Monitor_model = require('./database/monitor');

var app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(authRoutes);
app.use(monitorRoutes);
app.use(avatarRoutes);

// Resume monitoring on server startup
async function resumeMonitoring() {
  try {
    const activeMonitors = await Monitor_model.find({ isActive: true });
    console.log(`Found ${activeMonitors.length} active monitors to resume`);
    
    activeMonitors.forEach(monitor => {
      startMonitoring(monitor._id.toString(), monitor.userId.toString(), monitor.url, monitor.keyword);
    });
  } catch (err) {
    console.log("Error resuming monitoring:", err);
  }
}

app.listen(3700, () => {
  console.log('vinabaduthunda..........');
  resumeMonitoring();
});
