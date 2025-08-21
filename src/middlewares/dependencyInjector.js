const {
  ProfileHandler,
  LessonHandler,
  ProblemHandler,
} = require("../handlers");
const {
  UserRepository,
  LessonRepository,
  ProblemOptionRepository,
  ProblemRepository,
  SubmissionRepository,
  UserProgressRepository
} = require("../repositories");
const {
  ProfileService,
  LessonService,
  ProblemService,
  SubmissionService,
} = require("../services");

function dependencyInjector() {
  return (req, res, next) => {
    const { db } = req.app.locals;

    const profileHandler = new ProfileHandler(
      new ProfileService(new UserRepository(), db)
    );

    const lessonHandler = new LessonHandler({
      lessonService: new LessonService(new LessonRepository(), db),
      submissionService: new SubmissionService({
        userProgressRepository: new UserProgressRepository(),
        submissionRepository: new SubmissionRepository(),
        userRepository: new UserRepository()
      }, db)
    });

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
