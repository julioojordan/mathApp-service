const moment = require('moment-timezone');

const hasPassedDaysSinceUTC = (lastStreakISO, days = 1) => {
  if (!lastStreakISO) return true;
  const diff = moment.utc().diff(moment.utc(lastStreakISO), 'days');
  return diff >= days;
}

module.exports = hasPassedDaysSinceUTC
