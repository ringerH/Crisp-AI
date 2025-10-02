import { Modal, Descriptions, List, Tag, Typography, Space, Divider } from 'antd';
import { TrophyOutlined, StopOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;

export default function CandidateDetailModal({ candidate, onClose }) {
  if (!candidate) return null;

  const getScoreColor = (score) => {
    if (score >= 8) return '#52c41a'; // Green for high scores
    if (score >= 6) return '#faad14'; // Yellow for medium scores
    return '#ff4d4f'; // Red for low scores
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'success';
    if (status === 'Aborted') return 'error';
    return 'processing'; // For 'Pending Interview'
  };

  const scoreColor = getScoreColor(candidate.score);

  return (
    <Modal
      title={
        <div style={{ fontSize: '20px', fontWeight: 600 }}>
          Interview Details
        </div>
      }
      open={true}
      onCancel={onClose}
      footer={null}
      width={900}
      styles={{ body: { padding: '24px' } }}
    >
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          {candidate.name}
        </Title>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Email" span={2}>{candidate.email}</Descriptions.Item>
          <Descriptions.Item label="Phone" span={2}>{candidate.phone}</Descriptions.Item>
          <Descriptions.Item label="Status" span={2}>
            <Tag color={getStatusColor(candidate.status)} style={{ fontSize: '14px', padding: '4px 12px' }}>
              {candidate.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>

      <div style={{
        textAlign: 'center', padding: '32px 24px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: '12px', marginBottom: 32, border: '1px solid #e2e8f0'
      }}>
        {candidate.status !== 'Aborted' ? (
          <Space direction="vertical" size="small" align="center">
            <TrophyOutlined style={{ fontSize: '36px', color: scoreColor }} />
            <Title level={2} style={{ margin: 0, color: scoreColor, fontSize: '48px', fontWeight: 700 }}>
              {candidate.score}/10
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#718096', margin: 0, fontWeight: 500 }}>
              Final Score
            </Paragraph>
          </Space>
        ) : (
          // ENHANCEMENT: A cleaner display for aborted sessions
          <Space direction="vertical" size="small" align="center">
            <StopOutlined style={{ fontSize: '36px', color: '#8c8c8c' }} />
            <Title level={2} style={{ margin: 0, color: '#8c8c8c', fontSize: '48px', fontWeight: 700 }}>
              N/A
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#718096', margin: 0, fontWeight: 500 }}>
              Session Aborted
            </Paragraph>
          </Space>
        )}
      </div>

      {candidate.summary && (
        <div style={{ marginBottom: 32 }}>
          <Title level={4} style={{ marginBottom: 12 }}>AI Summary</Title>
          <div style={{ padding: '16px 20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <Paragraph style={{ margin: 0, fontSize: '15px', lineHeight: '1.8', color: '#4a5568' }}>
              {candidate.summary}
            </Paragraph>
          </div>
        </div>
      )}

      <Divider />

      <List
        header={<div style={{ fontSize: '16px', fontWeight: 600 }}>Question & Answer History</div>}
        bordered
        dataSource={candidate.answers || []}
        locale={{ emptyText: 'No answers were recorded for this session.' }}
        renderItem={(item, index) => (
          <List.Item style={{ padding: '20px' }}>
            <List.Item.Meta
              title={
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#2d3748', marginBottom: '12px' }}>
                  Question {index + 1}: {item.questionText}
                </div>
              }
              description={
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>
                      Candidate's Answer:
                    </div>
                    {/* THE FIX: Render the answer text as HTML */}
                    <div 
                      className="tiptap-rendered-content" 
                      dangerouslySetInnerHTML={{ __html: item.answerText }} 
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>
                      AI Feedback:
                    </div>
                    <Paragraph style={{ margin: 0, padding: '12px', background: '#fffbe6', borderRadius: '6px', color: '#5d4037', border: '1px solid #ffe58f' }}>
                      <Tag color={getScoreColor(item.score)} style={{ marginRight: 8 }}>
                        Score: {item.score}/10
                      </Tag>
                      {item.feedback}
                    </Paragraph>
                  </div>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
}