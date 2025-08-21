const handleError = require("../helpers/handleErrorHelper");

class profileHandler {
  constructor(profileService) {
    this.profileService = profileService;
  }

  async findOne(req, res) {
    const logger = req.app.locals.logger;
    try {
      const dataUser = await this.profileService.findOne(req);
      logger.info({
        msg: "Fetching data User sukses",
        params: req.params,
      });
      res.json({ code: 200, status: "Ok", response: dataUser });
    } catch (err) {
      return handleError(res, logger, err);
    }
  }
}

module.exports = profileHandler;
