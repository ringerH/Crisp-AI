import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in your .env.local file.");
}


const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


async function callGenerativeModel(prompt, expectJson = true) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (expectJson) {
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    }
    return text;
  } catch (error) {
    console.error("Google AI API Error:", error);
    throw new Error("Failed to get a response from Google AI. Please check your API key and usage limits.");
  }
}


export const fetchInterviewQuestions = async () => {
  console.log("AI Service: Fetching REAL questions from Google AI...");
  
  const prompt = `
    You are an expert interviewer for a full-stack web developer position using React and Node.js.
    Generate a list of exactly 6 interview questions: 2 easy, 2 medium, and 2 hard.
    Return ONLY a valid JSON array of objects. Do not include any other text, explanations, or markdown formatting.
    Each object must have the following keys: "questionId", "questionText", "difficulty", "timeLimit".
    The timeLimit must be a number: 20 for easy, 60 for medium, and 120 for hard.
    Use a unique string for each "questionId".
  `;
  
  return callGenerativeModel(prompt, true);
};

export const evaluateAnswer = async (answerText, questionText) => {
  console.log(`AI Service: Evaluating REAL answer for question: "${questionText}"`);

  const prompt = `
    As an expert interviewer, evaluate the following answer to the interview question provided.
    Provide a score from 1 to 10 and concise, constructive feedback (one sentence).
    Return ONLY a valid JSON object with the keys "score" (a number) and "feedback" (a string). Do not include any other text.
    Question: "${questionText}"
    Answer: "${answerText}"
  `;
  
  return callGenerativeModel(prompt, true);
};

export const generateFinalSummary = async (answers) => {
  console.log("AI Service: Generating REAL final summary...");

  const prompt = `
    As an expert interviewer, provide a brief, professional summary (2-3 sentences) of the candidate's performance based on their answers and scores.
    Do not return JSON, just return the summary as plain text.
    Here are the candidate's answers:
    ${JSON.stringify(answers, null, 2)}
  `;

  return callGenerativeModel(prompt, false);
};

/*
MOCK AI services

//import { v4 as uuidv4 } from 'uuid';
const questionBank = [
    { difficulty: "Easy", text: "What is the difference between `let` and `const` in JavaScript?" },
    { difficulty: "Easy", text: "Explain the concept of component state in React." },
    { difficulty: "Medium", text: "What are React Hooks? Can you name a few and explain their purpose?" },
    { difficulty: "Medium", text: "Describe the CSS box model." },
    { difficulty: "Hard", text: "Explain the event loop in Node.js." },
    { difficulty: "Hard", text: "What are some strategies for optimizing the performance of a React application?" },
];

const timeLimits = { Easy: 20, Medium: 60, Hard: 120 };

export const fetchInterviewQuestions = async () => {
    console.log("AI Service: Generating questions (mocked)...");
    const easy = questionBank.filter(q => q.difficulty === 'Easy').slice(0, 2);
    const medium = questionBank.filter(q => q.difficulty === 'Medium').slice(0, 2);
    const hard = questionBank.filter(q => q.difficulty === 'Hard').slice(0, 2);

    const questions = [...easy, ...medium, ...hard].map(q => ({
        questionId: uuidv4(),
        questionText: q.text,
        difficulty: q.difficulty,
        timeLimit: timeLimits[q.difficulty],
    }));
    
    return new Promise(resolve => setTimeout(() => resolve(questions), 500));
};

export const evaluateAnswer = async (answerText, questionText) => {
    console.log(`AI Service: Evaluating answer "${answerText}" for question: "${questionText}" (mocked)...`);
    const score = Math.floor(Math.random() * (9 - 6 + 1) + 6);
    const feedback = "This is a solid answer. The candidate demonstrates a good understanding of the core concepts.";
    
    return new Promise(resolve => setTimeout(() => resolve({ score, feedback }), 500));
};

export const generateFinalSummary = async () => {
    console.log("AI Service: Generating final summary (mocked)...");
    const summary = "The candidate performed well, showing strong foundational knowledge in React and Node.js. They communicated their answers clearly and concisely. Recommended for the next round.";
    
    return new Promise(resolve => setTimeout(() => resolve(summary), 500));
};
*/