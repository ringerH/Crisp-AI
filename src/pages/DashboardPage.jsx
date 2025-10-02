import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Input, Space } from 'antd';
import CandidateTable from '../components/CandidateTable';
import CandidateDetailModal from '../components/CandidateDetailModal';

const { Title } = Typography;
const { Search } = Input;

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  
  const candidates = useSelector((state) => state.candidates.list);
  
  const handleSelectCandidate = (id) => {
    setSelectedCandidateId(id);
  };
  
  const handleCloseModal = () => {
    setSelectedCandidateId(null);
  };
  
  const filteredCandidates = candidates.filter(c => 
    c && c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
  const selectedCandidate = candidates.find(c => c && c.candidateId === selectedCandidateId);
  
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Title level={3}>Candidates Dashboard</Title>
      <Search 
        placeholder="Search by candidate name" 
        onSearch={value => setSearchTerm(value)} 
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: 300 }} 
      />
      <CandidateTable 
        candidates={filteredCandidates} 
        onSelectCandidate={handleSelectCandidate} 
      />
      <CandidateDetailModal 
        candidate={selectedCandidate}
        onClose={handleCloseModal}
      />
    </Space>
  );
}