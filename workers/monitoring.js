const { default: axios } = require("axios")
const Registration_model = require('../database/registration');
const Monitor_model = require('../database/monitor');
const { sendMail } = require('./emailer');

// Store intervalIds for each monitor (monitorId -> intervalId)
let activeMonitors = {};

let monitor = async (monitorId, url, keyword, email) => {
  try {
    const res = await axios.get(`${url}`);
    const data = res.data;

    if (data.includes(keyword)) {
      console.log("key found")
      let emailstatus = await sendMail(email, keyword);
      if (emailstatus) {
        await Monitor_model.findByIdAndUpdate(monitorId, { isActive: false });
        console.log(`Monitor ${monitorId} marked inactive after notification`);
        stopMonitoring(monitorId);
      }
    } else {
      console.log("Results are not out yet")
    }
  } catch (err) {
    console.log("Error monitoring:", err.message);
  }
}

function startMonitoring(monitorId, userId, url, keyword) {
  // Stop if already monitoring this monitor
  if (activeMonitors[monitorId]) {
    console.log(`Monitor ${monitorId} already running`);
    return;
  }

  Registration_model.findById(userId).then((user) => {
    const email = user.email;
    console.log(`Starting monitoring for ${monitorId}`);
    
    // Store intervalId mapped to monitorId
    activeMonitors[monitorId] = setInterval(
      () => monitor(monitorId, url, keyword, email), 
      1000 * 20
    );
  }).catch((err) => console.log("Error fetching user:", err));
}

function stopMonitoring(monitorId) {
  if (activeMonitors[monitorId]) {
    console.log(`Stopping monitoring for ${monitorId}`);
    clearInterval(activeMonitors[monitorId]);
    delete activeMonitors[monitorId];
  }
}

function stopAllMonitoring() {
  Object.keys(activeMonitors).forEach(monitorId => {
    stopMonitoring(monitorId);
  });
}

function getActiveMonitors() {
  return activeMonitors;
}

module.exports = {
  startMonitoring,
  stopMonitoring,
  stopAllMonitoring,
  getActiveMonitors
};