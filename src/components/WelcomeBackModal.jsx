import { Modal, Button } from 'antd';

export default function WelcomeBackModal({ isOpen, onContinue, onEnd }) {
  return (
    <Modal
      title="Welcome Back!"
      open={isOpen}
      closable={false}
      footer={[
        <Button key="end" onClick={onEnd}>End Session & Start Over</Button>,
        <Button key="continue" type="primary" onClick={onContinue}>Continue Interview</Button>,
      ]}
    >
      <p>It looks like you were in the middle of an interview.</p>
      <p>Would you like to continue where you left off?</p>
    </Modal>
  );
}