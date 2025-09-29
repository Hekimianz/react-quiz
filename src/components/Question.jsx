import { useQuestions } from '../contexts/QuizContext';
import Options from './Options';
export default function Question() {
  const { question } = useQuestions();
  return (
    <div>
      <h4>{question.question}</h4>
      <Options />
    </div>
  );
}
