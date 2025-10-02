import { Table, Tag } from 'antd';

export default function CandidateTable({ candidates = [], onSelectCandidate }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag>{status}</Tag>,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
    },
    { 
      title: 'AI Summary', 
      dataIndex: 'summary', 
      key: 'summary',
      responsive: ['lg'], 
      ellipsis: true, 
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={candidates.map(c => ({ ...c, key: c.candidateId }))}
      onRow={(record) => ({
        onClick: () => onSelectCandidate(record.candidateId),
      })}
      rowClassName="cursor-pointer"
    />
  );
}