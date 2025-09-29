import { useQuestions } from '../contexts/QuizContext';

export default function StartScreen() {
  const { numQuestions, startQuiz } = useQuestions();
  return (
    <div className="start">
      <h2>Welcome to The React Quiz</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button className="btn btn-ui" onClick={startQuiz}>
        Let's Start
      </button>
    </div>
  );
}
