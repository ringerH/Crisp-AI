import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { parseResume } from '../services/resume.service';
import { startInterviewSession } from './interviewSlice';

export const processAndAddCandidate = createAsyncThunk(
  'candidates/processAndAdd',
  async (file) => {
    const extractedData = await parseResume(file);
    return extractedData;
  }
);

const initialState = {
  list: [],
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      state.list.push(action.payload);
    },
    updateCandidateResults: (state, action) => {
      const { candidateId, finalScore, aiSummary, answers } = action.payload;
      
      const existingCandidate = state.list.find(c => c && c.candidateId === candidateId);
      if (existingCandidate) {
        existingCandidate.status = 'Completed';
        existingCandidate.score = finalScore;
        existingCandidate.summary = aiSummary;
        existingCandidate.answers = answers;
      }
    },
    abortCandidateInterview: (state, action) => {
      const { candidateId } = action.payload;
      
      const existingCandidate = state.list.find(c => c && c.candidateId === candidateId);
      if (existingCandidate) {
        existingCandidate.status = 'Aborted';
        existingCandidate.score = 'N/A';
        existingCandidate.summary = 'Session was ended prematurely by the user.';
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startInterviewSession.fulfilled, (state, action) => {
      
      if (action.payload.candidateData) {
        state.list.push(action.payload.candidateData);
      }
    });
  },
});

export const { addCandidate, updateCandidateResults, abortCandidateInterview } = candidatesSlice.actions;
export default candidatesSlice.reducer;