import './App.css';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Layout, Tabs } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import IntervieweePage from './pages/IntervieweePage';
import DashboardPage from './pages/DashboardPage';
import WelcomeBackModal from './components/WelcomeBackModal';
import { setShowWelcomeModal, setActiveTab } from './store/appSlice';
import { resetInterview } from './store/interviewSlice';
import { abortCandidateInterview } from './store/candidatesSlice';

const { Header, Content } = Layout;

const TAB_KEYS = {
  INTERVIEWEE: 'interviewee',
  DASHBOARD: 'dashboard',
};

const INTERVIEW_STATUS = {
  IN_PROGRESS: 'in-progress',
};

function App() {
  const dispatch = useDispatch();
  
  const activeTab = useSelector((state) => state.app?.activeTab ?? TAB_KEYS.INTERVIEWEE);
  const showModal = useSelector((state) => state.app?.showWelcomeModal ?? false);
  const interview = useSelector((state) => state.interview ?? {});

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  
  useEffect(() => {
    if (isInitialLoad && interview.status === INTERVIEW_STATUS.IN_PROGRESS) {
      dispatch(setShowWelcomeModal(true));
    }
    setIsInitialLoad(false);
  }, [isInitialLoad, interview.status, dispatch]);
  
  const handleTabChange = useCallback((key) => {
    if (key && Object.values(TAB_KEYS).includes(key)) {
      dispatch(setActiveTab(key));
    }
  }, [dispatch]);
  
  const handleContinue = useCallback(() => {
    dispatch(setShowWelcomeModal(false));
  }, [dispatch]);
  
  const handleEnd = useCallback(() => {
    try {
      
      if (interview.candidateId) {
        dispatch(abortCandidateInterview({ candidateId: interview.candidateId }));
      }
      
      
      dispatch(resetInterview());
      
      
      dispatch(setShowWelcomeModal(false));
    } catch (error) {
      console.error('Error ending interview:', error);
      
    }
  }, [dispatch, interview.candidateId]);
  
  
  const items = useMemo(() => [
    { 
      key: TAB_KEYS.INTERVIEWEE, 
      label: 'Interviewee View', 
      children: <IntervieweePage /> 
    },
    { 
      key: TAB_KEYS.DASHBOARD, 
      label: 'Dashboard View', 
      children: <DashboardPage /> 
    },
  ], []);

  
  const headerStyle = useMemo(() => ({ 
    color: 'white',
    fontSize: '20px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  }), []);

  const contentStyle = useMemo(() => ({ 
    padding: '24px',
    minHeight: 'calc(100vh - 64px)',
  }), []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={headerStyle}>
        AI Interview Assistant (Crisp)
      </Header>
      
      <Content style={contentStyle}>
        <Tabs 
          activeKey={activeTab} 
          items={items} 
          onChange={handleTabChange}
          destroyInactiveTabPane={false}
        />
      </Content>
      
      <WelcomeBackModal 
        isOpen={showModal} 
        onContinue={handleContinue} 
        onEnd={handleEnd} 
      />
    </Layout>
  );
}

export default App;