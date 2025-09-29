/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from 'react';

const QuizContext = createContext();
const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const SECS_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case 'dataRecieved':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case 'newAnswer': {
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return { ...initialState, status: 'ready', questions: state.questions };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    default:
      throw new Error('Action is unknown');
  }
}

function QuestionsProvider({ children }) {
  useEffect(() => {
    const fetchQuestions = () => {
      fetch('http://localhost:8000/questions')
        .then((res) => res.json())
        .then((data) => dispatch({ type: 'dataRecieved', payload: data }))
        .catch(() => dispatch({ type: 'dataFailed' }));
    };
    fetchQuestions();
  }, []);

  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0);
  const question = questions[index];

  function startQuiz() {
    dispatch({ type: 'start' });
  }

  function newAnswer(index) {
    dispatch({ type: 'newAnswer', payload: index });
  }

  function tick() {
    dispatch({ type: 'tick' });
  }

  function nextQuestion() {
    dispatch({ type: 'nextQuestion' });
  }

  function finish() {
    dispatch({ type: 'finish' });
  }

  function restart() {
    dispatch({ type: 'restart' });
  }

  return (
    <QuizContext.Provider
      value={{
        questions,
        question,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPoints,
        startQuiz,
        newAnswer,
        tick,
        nextQuestion,
        finish,
        restart,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuestions() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error('QuestionsContext was used outside of QuestionsProvider');
  return context;
}

export { QuestionsProvider, useQuestions };
