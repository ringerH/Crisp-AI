import { Modal, Descriptions, List, Tag, Typography, Space, Divider } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;

export default function CandidateDetailModal({ candidate, onClose }) {
  if (!candidate) return null;

  const getScoreColor = (score) => {
    if (score >= 8) return '#52c41a';
    if (score >= 6) return '#faad14';
    return '#ff4d4f';
  };

  const scoreColor = getScoreColor(candidate.score);

  return (
    <Modal
      title={
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 600,
          color: '#1a202c'
        }}>
          Interview Details
        </div>
      }
      open={true}
      onCancel={onClose}
      footer={null}
      width={900}
      styles={{
        body: { padding: '24px' }
      }}
    >
      {/* Candidate Info Section */}
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 16, color: '#2d3748' }}>
          {candidate.name}
        </Title>
        
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Email" span={2}>
            {candidate.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={2}>
            {candidate.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={2}>
            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {candidate.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* Final Score - Centered */}
      <div style={{
        textAlign: 'center',
        padding: '32px 24px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: '12px',
        marginBottom: 32,
        border: '2px solid #e2e8f0'
      }}>
        <Space direction="vertical" size="small" align="center">
          <TrophyOutlined style={{ 
            fontSize: '36px', 
            color: scoreColor 
          }} />
          <Title 
            level={2} 
            style={{ 
              margin: 0, 
              color: scoreColor,
              fontSize: '48px',
              fontWeight: 700
            }}
          >
            {candidate.score}/10
          </Title>
          <Paragraph style={{ 
            fontSize: '16px', 
            color: '#718096',
            margin: 0,
            fontWeight: 500
          }}>
            Final Score
          </Paragraph>
        </Space>
      </div>

      {/* AI Summary Section */}
      {candidate.summary && (
        <div style={{ marginBottom: 32 }}>
          <Title level={4} style={{ marginBottom: 12, color: '#2d3748' }}>
            AI Summary
          </Title>
          <div style={{
            padding: '16px 20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <Paragraph style={{ 
              margin: 0, 
              fontSize: '15px',
              lineHeight: '1.8',
              color: '#4a5568'
            }}>
              {candidate.summary}
            </Paragraph>
          </div>
        </div>
      )}

      <Divider />

      {/* Q&A History */}
      <List
        header={
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 600,
            color: '#2d3748'
          }}>
            Question & Answer History
          </div>
        }
        bordered
        dataSource={candidate.answers || []}
        locale={{ emptyText: 'No answers recorded' }}
        renderItem={(item, index) => (
          <List.Item style={{ padding: '20px' }}>
            <List.Item.Meta
              title={
                <div style={{ 
                  fontSize: '15px', 
                  fontWeight: 600,
                  color: '#2d3748',
                  marginBottom: '12px'
                }}>
                  Question {index + 1}: {item.questionText}
                </div>
              }
              description={
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <div style={{ 
                      fontWeight: 600, 
                      color: '#4a5568',
                      marginBottom: '6px'
                    }}>
                      Answer:
                    </div>
                    <Paragraph style={{ 
                      margin: 0,
                      padding: '12px',
                      background: '#f8f9fa',
                      borderRadius: '6px',
                      color: '#2d3748'
                    }}>
                      {item.answerText}
                    </Paragraph>
                  </div>
                  
                  <div>
                    <div style={{ 
                      fontWeight: 600, 
                      color: '#4a5568',
                      marginBottom: '6px'
                    }}>
                      Feedback:
                    </div>
                    <Paragraph style={{ 
                      margin: 0,
                      padding: '12px',
                      background: '#fff3e0',
                      borderRadius: '6px',
                      color: '#5d4037'
                    }}>
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