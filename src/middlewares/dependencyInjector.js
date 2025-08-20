const {
  ProfileHandler,
  LessonHandler,
  ProblemHandler,
} = require("../handlers");
const {
  UserRepository,
  LessonRepository,
  ProblemOptionRepository,
  ProblemRepository
} = require("../repositories");
const { UserService, LessonService, ProblemService } = require("../services");

function dependencyInjector() {
  return (req, res, next) => {
    const { db } = req.app.locals;

    const profileHandler = new ProfileHandler(
      new UserService(new UserRepository(), db)
    );

    const lessonHandler = new LessonHandler(
      new LessonService(new LessonRepository(), db)
    );

    const problemHandler = new ProblemHandler(
      new ProblemService(
        {
          problemOptionRepository: new ProblemOptionRepository(),
          problemRepository: new ProblemRepository(),
        },
        db
      )
    );

    req.app.locals.handlers = {
      profileHandler,
      lessonHandler,
      problemHandler,
    };

    next();
  };
}

module.exports = dependencyInjector;
