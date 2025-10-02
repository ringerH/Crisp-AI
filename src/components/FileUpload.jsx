import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


export default function FileUpload({ onFileSelect }) {
  const props = {
    name: 'file',
    accept: '.pdf,.docx',
    beforeUpload: (file) => {      
      onFileSelect(file);      
      return false;
    },
    maxCount: 1,
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Click to Upload Resume</Button>
    </Upload>
  );
}