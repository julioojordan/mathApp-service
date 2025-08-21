const castIdToInt = (req, res, next) => {
  const castKeysToInt = (obj) => {
    if (!obj) return;

    for (const key in obj) {
      if (/id/i.test(key)) {
        const parsed = parseInt(obj[key], 10);
        if (!isNaN(parsed)) {
          obj[key] = parsed;
        }
      }
    }
  };

  castKeysToInt(req.params);
  castKeysToInt(req.query);

  next();
};

module.exports = castIdToInt;
