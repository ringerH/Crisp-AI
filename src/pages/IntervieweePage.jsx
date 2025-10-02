import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Space, Typography, Button, Alert, Row, Col, Card } from 'antd';
import FileUpload from '../components/FileUpload';
import ChatWindow from '../components/ChatWindow';
import Timer from '../components/Timer';
import ConfirmDetailsModal from '../components/ConfirmDetailsModal';
import { processAndAddCandidate, updateCandidateResults } from '../store/candidatesSlice';
import { 
  startInterviewSession, 
  submitAndEvaluateAnswer, 
  tickTimer, 
  endInterviewAndSummarize, 
  resetInterview 
} from '../store/interviewSlice';
import { v4 as uuidv4 } from 'uuid';

const { Title, Paragraph } = Typography;


const INTERVIEW_STATUS = {
  IDLE: 'idle',
  PARSING: 'parsing',
  LOADING: 'loading',
  AWAITING_CONFIRMATION: 'awaiting-confirmation',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  ERROR: 'error',
};

export default function IntervieweePage() {
  const dispatch = useDispatch();
  const interview = useSelector((state) => state.interview);
  const [currentAnswer, setCurrentAnswer] = useState('');

  

 
  useEffect(() => {
    if (interview.status === INTERVIEW_STATUS.IN_PROGRESS) {
      const interval = setInterval(() => { 
        dispatch(tickTimer()); 
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [interview.status, dispatch, interview.currentQuestionIndex]);

  
  useEffect(() => {
    if (
      interview.timer <= 0 && 
      interview.status === INTERVIEW_STATUS.IN_PROGRESS && 
      !interview.isSubmitting &&
      interview.questions?.length > 0
    ) {
      const currentQuestion = interview.questions[interview.currentQuestionIndex];
      if (currentQuestion) {
        dispatch(submitAndEvaluateAnswer({
          questionId: currentQuestion.questionId,
          questionText: currentQuestion.questionText,
          answerText: currentAnswer.trim() || "(No answer provided)", 
        }));
        setCurrentAnswer('');
      }
    }
  }, [interview.timer, interview.status, interview.isSubmitting, interview.questions, interview.currentQuestionIndex, currentAnswer, dispatch]);
  
  
  useEffect(() => {
    if (interview.status === INTERVIEW_STATUS.COMPLETED && !interview.aiSummary) {
      dispatch(endInterviewAndSummarize(interview.answers)).then((resultAction) => {
        if (endInterviewAndSummarize.fulfilled.match(resultAction)) {
          dispatch(updateCandidateResults({
            candidateId: interview.candidateId,
            finalScore: resultAction.payload.finalScore,
            aiSummary: resultAction.payload.summary,
            answers: interview.answers,
          }));
        }
      });
    }
  }, [interview.status, interview.aiSummary, interview.answers, interview.candidateId, dispatch]);

  // Event Handlers

  const handleFileSelect = useCallback((file) => {
    dispatch(processAndAddCandidate(file));
  }, [dispatch]);

  const handleConfirmAndStart = useCallback((confirmedData) => {
    const newCandidate = {
      candidateId: uuidv4(),
      name: confirmedData.name,
      email: confirmedData.email,
      phone: confirmedData.phone || 'N/A',
      status: 'Pending Interview',
      createdAt: new Date().toISOString(),
      score: null,
      answers: [],
      summary: '',
    };
    dispatch(startInterviewSession(newCandidate));
  }, [dispatch]);
  
  const handleSendMessage = useCallback((answerText) => {
    const currentQuestion = interview.questions?.[interview.currentQuestionIndex];
    if (currentQuestion) {
      dispatch(submitAndEvaluateAnswer({
        questionId: currentQuestion.questionId,
        questionText: currentQuestion.questionText,
        answerText,
      }));
      setCurrentAnswer('');
    }
  }, [interview.questions, interview.currentQuestionIndex, dispatch]);

  const handleResetInterview = useCallback(() => {
    dispatch(resetInterview());
  }, [dispatch]);

  // Memoized data

  const messages = useMemo(() => {
    const msgs = [];
    if (interview.questions?.length > 0) {
      interview.questions.slice(0, interview.currentQuestionIndex + 1).forEach((q) => {
        msgs.push({ sender: 'ai', text: q.questionText });
        const answer = interview.answers.find(a => a.questionId === q.questionId);
        if (answer) {
          msgs.push({ sender: 'user', text: answer.answerText });
          msgs.push({ 
            sender: 'ai', 
            text: `Score: ${answer.score}/10. ${answer.feedback}` 
          });
        }
      });
    }
    return msgs;
  }, [interview.questions, interview.currentQuestionIndex, interview.answers]);

  
  // render logic
  const renderContent = () => {
    const centeredStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 250px)',
      padding: '20px',
    };

    switch (interview.status) {
      case INTERVIEW_STATUS.IDLE:
        return (
          <div style={centeredStyle}>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        );

      case INTERVIEW_STATUS.PARSING:
      case INTERVIEW_STATUS.LOADING:
        return (
          <div style={centeredStyle}>
            <Title level={4}>Getting interview ready...</Title>
          </div>
        );
      
      case INTERVIEW_STATUS.IN_PROGRESS:
        return (
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="large">
                <Title level={4}>
                  Question {interview.currentQuestionIndex + 1} of {interview.questions?.length || 0}
                </Title>
                <Timer seconds={interview.timer} />
              </Space>
            </Col>
            <Col xs={24} md={16}>
              <ChatWindow 
                messages={messages} 
                onSendMessage={handleSendMessage}
                inputValue={currentAnswer}
                onInputChange={setCurrentAnswer}
                disabled={interview.isSubmitting}
              />
            </Col>
          </Row>
        );
      
      case INTERVIEW_STATUS.COMPLETED:
        return (
          <div style={centeredStyle}>
            <Space direction="vertical" size="large" style={{ textAlign: 'center', alignItems: 'center' }}>
              <Title level={2}>Interview Completed! 🎉</Title>
              <Paragraph style={{ fontSize: '16px' }}>
                Thank you for your time and effort.
              </Paragraph>
              <Card 
                title={<Title level={3} style={{ margin: 0, textAlign: 'center' }}>Final Score: {interview.finalScore || '...'} / 10</Title>}
                style={{ width: '100%', maxWidth: '600px' }}
              >
                <Paragraph style={{ textAlign: 'left', fontSize: '15px' }}>
                  <strong>AI Summary:</strong>
                  <br />
                  {interview.aiSummary || 'Generating summary...'}
                </Paragraph>
              </Card>
              <Button 
                type="primary" 
                size="large"
                onClick={handleResetInterview}
              >
                Start a New Interview
              </Button>
            </Space>
          </div>
        );

      case INTERVIEW_STATUS.ERROR:
        return (
          <div style={centeredStyle}>
            <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: '500px' }}>
              <Alert message="Error" description={interview.error || 'An unexpected error occurred'} type="error" showIcon />
              <Button type="primary" onClick={handleResetInterview}>Try Again</Button>
            </Space>
          </div>
        );

      default:
        return (
          <div style={centeredStyle}>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        );
    }
  };

  return (
    <div>
      {renderContent()}
      <ConfirmDetailsModal
        isOpen={interview.status === INTERVIEW_STATUS.AWAITING_CONFIRMATION}
        initialData={interview.extractedData}
        onConfirm={handleConfirmAndStart}
      />
    </div>
  );
}

