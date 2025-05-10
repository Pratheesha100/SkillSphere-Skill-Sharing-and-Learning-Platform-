import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuizCard from './QuizCard';
import Timer from './Timer';
import Swal from 'sweetalert2';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/games');
      const mcqQuestions = response.data.filter(game => game.type === 'MCQ');
      setQuestions(mcqQuestions);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load questions. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    // Check if this is the last question
    if (currentQuestionIndex === questions.length - 1) {
      // If it's the last question, complete the quiz
      handleQuizCompletion(newAnswers);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleQuizCompletion = (finalAnswers) => {
    // Calculate results
    const correctAnswersCount = finalAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswersCount / questions.length) * 100);

    // Create results object
    const results = {
      correctAnswers: correctAnswersCount,
      totalQuestions: questions.length,
      score: score,
      timeTaken: 300 - timeLeft,
      answers: finalAnswers,
      questions: questions
    };

    // Store results in localStorage
    localStorage.setItem('quizResults', JSON.stringify(results));

    // Show completion message
    Swal.fire({
      title: 'Quiz Completed!',
      text: `You scored ${correctAnswersCount} out of ${questions.length}`,
      icon: 'success',
      confirmButtonText: 'View Summary'
    }).then(() => {
      // Navigate to summary page after user clicks the button
      navigate('/gamehub/quiz-summary', { 
        state: { results }
      });
    });
  };

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0) {
      handleQuizCompletion(answers);
    }
  }, [timeLeft]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-6">There are no questions available at the moment.</p>
          <button
            onClick={() => navigate('/gamehub')}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Game Hub
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = [
    currentQuestion.answer1,
    currentQuestion.answer2,
    currentQuestion.answer3,
    currentQuestion.answer4
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
              <p className="text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeUp={() => handleQuizCompletion(answers)} />
          </div>
        </div>

        {/* Quiz Card */}
        <QuizCard
          question={currentQuestion.questionText}
          options={options}
          onAnswer={handleAnswer}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          onFinishQuiz={(selectedOption) => {
            // Add or update the last answer
            let newAnswers = [...answers];
            if (newAnswers.length < questions.length) {
              newAnswers.push(selectedOption);
            } else {
              newAnswers[newAnswers.length - 1] = selectedOption;
            }
            handleQuizCompletion(newAnswers);
          }}
        />
      </div>
    </div>
  );
};

export default Quiz;