import { Button, Space } from 'antd';
import { BoldOutlined, ItalicOutlined, UnorderedListOutlined, OrderedListOutlined } from '@ant-design/icons';

export default function TiptapToolbar({ editor }) {
  if (!editor) {
    return null;
  }

  return (
    <Space style={{ padding: '8px', border: '1px solid #d9d9d9', borderBottom: 'none', borderRadius: '6px 6px 0 0' }}>
      <Button
        type={editor.isActive('bold') ? 'primary' : 'text'}
        icon={<BoldOutlined />}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <Button
        type={editor.isActive('italic') ? 'primary' : 'text'}
        icon={<ItalicOutlined />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <Button
        type={editor.isActive('bulletList') ? 'primary' : 'text'}
        icon={<UnorderedListOutlined />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <Button
        type={editor.isActive('orderedList') ? 'primary' : 'text'}
        icon={<OrderedListOutlined />}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
    </Space>
  );
}