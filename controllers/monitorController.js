const Monitor_model = require('../database/monitor');
const Activity_model = require('../database/activity');

const { startMonitoring, stopMonitoring } = require('../workers/monitoring')

exports.addMonitor = async (req, res) => {
  try {
    const { userId, websiteName, websiteURL, frequency = 'daily', keyword = '' } = req.body;

    if (!userId) {
      return res.status(400).send({ success: false, message: 'userId is required' });
    }

    if (!websiteName || !websiteURL) {
      return res.status(400).send({
        success: false,
        message: 'websiteName and websiteURL are required'
      });
    }

    const newMonitor = new Monitor_model({
      userId,
      name: websiteName,
      url: websiteURL,
      keyword,
      frequency,
      isActive: true
    });

    await newMonitor.save();
    
    // Log activity
    await Activity_model.create({
      userId,
      monitorId: newMonitor._id,
      websiteName,
      action: 'added',
      description: `Added website: ${websiteName}`,
      details: { url: websiteURL, keyword, frequency }
    });
    
    // Pass monitorId as first parameter
    startMonitoring(newMonitor._id.toString(), userId, websiteURL, keyword);
    res.send({ success: true, message: 'monitor added' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error adding monitor' });
  }
};

exports.getMonitors = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).send({ success: false, message: 'userId is required' });
    }

    const data = await Monitor_model.find({ userId });
    res.send({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error fetching monitors' });
  }
};

exports.deleteMonitor = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send({ success: false, message: 'monitorId is required' });
    }

    const monitor = await Monitor_model.findById(id);
    
    // Stop monitoring before deleting
    stopMonitoring(id);
    
    // Log activity
    await Activity_model.create({
      userId: monitor.userId,
      monitorId: id,
      websiteName: monitor.name,
      action: 'deleted',
      description: `Deleted website: ${monitor.name}`,
      details: { url: monitor.url }
    });
    
    await Monitor_model.deleteOne({ _id: id });
    res.send({ success: true, message: 'monitor deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error deleting monitor' });
  }
};

exports.updateMonitor = async (req, res) => {
  try {
    const { id, status } = req.body;
    
    if (!id) {
      return res.status(400).send({ success: false, message: 'id is required' });
    }

    const monitor = await Monitor_model.findById(id);
    
    if (!monitor) {
      return res.status(404).send({ success: false, message: 'monitor not found' });
    }
    
    // If toggling isActive status
    if (status !== undefined && status !== monitor.isActive) {
      if (status) {
        // Resume monitoring
        startMonitoring(id, monitor.userId.toString(), monitor.url, monitor.keyword);
        // Log activity
        await Activity_model.create({
          userId: monitor.userId,
          monitorId: id,
          websiteName: monitor.name,
          action: 'activated',
          description: `Started monitoring: ${monitor.name}`,
          details: { url: monitor.url }
        });
      } else {
        // Stop monitoring
        stopMonitoring(id);
        // Log activity
        await Activity_model.create({
          userId: monitor.userId,
          monitorId: id,
          websiteName: monitor.name,
          action: 'deactivated',
          description: `Stopped monitoring: ${monitor.name}`,
          details: { url: monitor.url }
        });
      }
    }

    const updatedMonitor = await Monitor_model.findByIdAndUpdate(id, { isActive: status }, { new: true });
    res.send({ success: true, message: 'monitor updated', data: updatedMonitor });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error updating monitor' });
  }
};

exports.resumeUserMonitors = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send({ success: false, message: 'userId is required' });
    }

    const activeMonitors = await Monitor_model.find({ userId, isActive: true });
    activeMonitors.forEach(monitor => {
      startMonitoring(monitor._id.toString(), monitor.userId.toString(), monitor.url, monitor.keyword);
    });

    res.send({ success: true, message: 'user monitors resumed', started: activeMonitors.length });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error resuming monitors' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).send({ success: false, message: 'userId is required' });
    }

    const data = await Monitor_model.find({ userId });
    const totalNotifications = data.reduce((count, monitor) => {
      return count + (Array.isArray(monitor.notifications) ? monitor.notifications.length : 0);
    }, 0);

    res.send({
      success: true,
      data: {
        totalWebsites: data.length,
        activeWebsites: data.filter(m => m.isActive).length,
        inactiveWebsites: data.filter(m => !m.isActive).length,
        notifications: totalNotifications
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error fetching dashboard data' });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).send({ success: false, message: 'userId is required' });
    }

    const activities = await Activity_model.find({ userId }).sort({ createdAt: -1 }).limit(20);
    res.send({ success: true, data: activities });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error fetching activities' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).send({ success: false, message: 'userId is required' });
    }

    const data = await Monitor_model.find({ userId });
    res.send({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error fetching user details' });
  }
}