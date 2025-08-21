const getIsCorrect = (
  type = "multiple",
  correctAnswers = [],
  userInput = {}
) => {
  if (type === "multiple") {
    const correctOptionIds = correctAnswers.map((opt) => String(opt.id));
    return correctOptionIds.includes(String(userInput.option_id));
  }

  if (type === "text") {
    const correctLabels = correctAnswers.map((opt) =>
      String(opt.label || "")
        .trim()
        .toLowerCase()
    );
    const userAnswer = String(userInput.value || "")
      .trim()
      .toLowerCase();
    return correctLabels.includes(userAnswer);
  }

  // fallback: unrecognized type
  return false;
};

module.exports = getIsCorrect;
