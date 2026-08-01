export default function CompareGuess(guess, answer) {
    return {
      position: compareExact(guess.position, answer.position),
  
      draftTeam: compareExact(guess.draftTeam, answer.draftTeam),
  
      draftYear: compareNumber(guess.draftYear, answer.draftYear),
  
      currentTeam: compareExact(guess.currentTeam, answer.currentTeam),
  
      isActive: compareExact(guess.isActive, answer.isActive),
  
      number: compareNumber(guess.number, answer.number),
    };
  }
  
  function compareExact(guessValue, answerValue) {
    return guessValue === answerValue ? "correct" : "wrong";
  }
  
  function compareNumber(guessValue, answerValue) {
    if (guessValue === answerValue) {
      return "correct";
    }
  
    if (guessValue < answerValue) {
      return "higher"; // Guess a higher number
    }
  
    return "lower"; // Guess a lower number
  }