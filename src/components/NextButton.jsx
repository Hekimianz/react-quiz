import { useQuestions } from '../contexts/QuizContext';

export default function NextButton() {
  const { answer, index, numQuestions, nextQuestion, finish } = useQuestions();
  if (answer === null) return null;
  if (index < numQuestions - 1) {
    return (
      <button className="btn btn-ui" onClick={nextQuestion}>
        Next
      </button>
    );
  }

  if (index === numQuestions - 1) {
    return (
      <button className="btn btn-ui" onClick={finish}>
        Finish
      </button>
    );
  }
}
