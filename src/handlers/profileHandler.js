const handleError = require("../helpers/handleErrorHelper");

class profileHandler {
  constructor(profileService) {
    this.profileService = profileService;
  }

  async findOne(req, res) {
    const logger = req.app.locals.logger;
    try {
      const dataUser = await this.profileService.findOne(req.params.id);
      logger.info({
        msg: "Fetching data User sukses",
        params: req.params,
      });
      res.json({ code: 200, status: "Ok", data: dataUser });
    } catch (err) {
      return handleError(res, logger, err);
    }
  }

  async update(req, res) {
    // update exp, streak
  }
}

module.exports = profileHandler;
