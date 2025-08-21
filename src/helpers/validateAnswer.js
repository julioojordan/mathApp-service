const validateAnswer = (metaAnswers, submittedAnswers) => {
  if (metaAnswers.length !== submittedAnswers.length) return false;

  const mapMeta = new Map(
    metaAnswers.map((m) => [m.problem_id, m.option_id ?? m.value])
  );

  for (const ans of submittedAnswers) {
    const submittedValue = ans.option_id ?? ans.value;
    if (
      !mapMeta.has(ans.problem_id) ||
      mapMeta.get(ans.problem_id) !== submittedValue
    ) {
      return false;
    }
  }
  return true;
};

module.exports = validateAnswer
