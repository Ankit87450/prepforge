import { create } from 'zustand'

export const useInterviewStore = create((set) => ({
  currentInterview: null,
  questions: [],
  feedbacks: {},
  currentQuestionIndex: 0,

  setInterview: (interview) => set({ currentInterview: interview }),
  setQuestions: (questions) => set({ questions, currentQuestionIndex: 0 }),
  setFeedback: (questionId, feedback) =>
    set((state) => ({ feedbacks: { ...state.feedbacks, [questionId]: feedback } })),
  nextQuestion: () =>
    set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
  reset: () =>
    set({ currentInterview: null, questions: [], feedbacks: {}, currentQuestionIndex: 0 }),
}))
