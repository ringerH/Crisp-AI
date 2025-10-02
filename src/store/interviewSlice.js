import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { processAndAddCandidate } from './candidatesSlice';
import { fetchInterviewQuestions, evaluateAnswer, generateFinalSummary } from '../services/ai.service';

export const startInterviewSession = createAsyncThunk(
  'interview/startSession', 
  async (payload) => { // payload is the full newCandidate object
    const questions = await fetchInterviewQuestions();
    
    return { questions, candidateData: payload }; 
  }
);

export const submitAndEvaluateAnswer = createAsyncThunk(
  'interview/submitAnswer', 
  async (answerPayload) => {
    const evaluation = await evaluateAnswer(answerPayload.answerText, answerPayload.questionText);
    return { ...answerPayload, ...evaluation, answerId: uuidv4() };
  }
);

export const endInterviewAndSummarize = createAsyncThunk(
  'interview/endSession', 
  async (answers) => {
    const summary = await generateFinalSummary(answers);
    const totalScore = answers.reduce((sum, ans) => sum + ans.score, 0);
    const finalScore = Math.round(totalScore / answers.length) || 0;
    return { summary, finalScore };
  }
);

const initialState = {
  sessionId: null,
  candidateId: null,
  status: 'idle',
  isSubmitting: false, 
  error: null, 
  extractedData: null,
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
  timer: 30,
  finalScore: null,
  aiSummary: null,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    tickTimer: (state) => { 
      if (state.timer > 0) {
        state.timer -= 1; 
      }
    },
    resetInterview: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(processAndAddCandidate.pending, (state) => {
        state.status = 'parsing';
      })
      .addCase(processAndAddCandidate.fulfilled, (state, action) => {
        state.status = 'awaiting-confirmation';
        state.extractedData = action.payload;
      })
      .addCase(startInterviewSession.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(startInterviewSession.fulfilled, (state, action) => {
        state.status = 'in-progress';
        state.sessionId = uuidv4();
        state.questions = action.payload.questions;
        // Also update the active candidateId from the returned data
        state.candidateId = action.payload.candidateData.candidateId;
        state.currentQuestionIndex = 0;
        state.timer = action.payload.questions[0].timeLimit;
      })
      .addCase(startInterviewSession.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to start interview. Please try again.';
      })
      .addCase(submitAndEvaluateAnswer.pending, (state) => {
        state.isSubmitting = true; 
      })
      .addCase(submitAndEvaluateAnswer.fulfilled, (state, action) => {
        state.answers.push(action.payload);
        if (state.currentQuestionIndex >= state.questions.length - 1) {
          state.status = 'completed';
        } else {
          state.currentQuestionIndex += 1;
          const nextQuestion = state.questions[state.currentQuestionIndex];
          state.timer = nextQuestion.timeLimit;
        }
        state.isSubmitting = false;
      })
      .addCase(submitAndEvaluateAnswer.rejected, (state) => {
        state.isSubmitting = false;
      })
      .addCase(endInterviewAndSummarize.fulfilled, (state, action) => {
        state.aiSummary = action.payload.summary;
        state.finalScore = action.payload.finalScore;
      });
  },
});

export const { tickTimer, resetInterview } = interviewSlice.actions;
export default interviewSlice.reducer;