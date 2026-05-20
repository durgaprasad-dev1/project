const express = require('express');
const {
  addMonitor,
  getMonitors,
  getDashboard,
  deleteMonitor,
  updateMonitor,
  resumeUserMonitors,
  getActivities,
  getUserDetails
} = require('../controllers/monitorController');

const router = express.Router();

router.post('/addmonitor', addMonitor);
router.get('/getmonitors', getMonitors);
router.get('/dashboard', getDashboard);
router.get('/websites/stats/dashboard', getDashboard);
router.delete('/deletemonitor', deleteMonitor);
router.put('/updatemonitor', updateMonitor);
router.post('/resumeusermonitors', resumeUserMonitors);
router.get('/activities', getActivities);
router.get('/user/details', getUserDetails);

module.exports = router;
