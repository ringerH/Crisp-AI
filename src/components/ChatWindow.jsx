import { Button, List, Space } from 'antd';
import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapToolbar from './TiptapToolbar';
import './ChatWindow.css'; // Import the styles for the editor

export default function ChatWindow({ messages = [], onSendMessage, inputValue, onInputChange, disabled = false }) {
  const listRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // You can configure the starter kit if needed, e.g., disable some options
      }),
    ],
    content: inputValue,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // When the user types, send the HTML content back up to the parent component
      onInputChange(editor.getHTML());
    },
  });

  // This effect ensures that if the parent component clears the input (e.g., after sending),
  // the editor's content is also cleared.
  useEffect(() => {
    if (editor && editor.getHTML() !== inputValue) {
      editor.commands.setContent(inputValue);
    }
  }, [inputValue, editor]);
  
  // This effect ensures the editor can be disabled/enabled from the parent
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  // This effect automatically scrolls the chat list to the bottom when new messages arrive
  useEffect(() => {
    if (listRef.current) {
      const scrollableElement = listRef.current.querySelector('.ant-spin-container') || listRef.current;
      if (scrollableElement) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (editor && !editor.isEmpty) {
      onSendMessage(editor.getHTML());
      // The parent component will clear the inputValue, which will then trigger the effect above
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)' }}>
      {/* Scrollable chat history */}
      <div ref={listRef} style={{ flex: '1 1 auto', overflowY: 'auto', marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item style={{ border: 'none', padding: '4px 0', textAlign: item.sender === 'ai' ? 'left' : 'right' }}>
              <List.Item.Meta
                title={item.sender === 'ai' ? 'AI Interviewer' : 'You'}
                description={
                  <div 
                    style={{ 
                      background: item.sender === 'ai' ? '#fff' : '#e6f7ff', 
                      padding: '8px 12px', 
                      borderRadius: '12px', 
                      display: 'inline-block',
                      textAlign: 'left'
                    }} 
                    dangerouslySetInnerHTML={{ __html: item.text }} 
                  />
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* Tiptap Rich Text Editor and Send Button */}
      <div className="chat-input-container">
        <TiptapToolbar editor={editor} />
        <EditorContent editor={editor} />
        <Button 
          type="primary" 
          onClick={handleSend} 
          loading={disabled}
          disabled={disabled}
          style={{ marginTop: '8px', float: 'right' }}
        >
          {disabled ? "Submitting" : "Send"}
        </Button>
      </div>
    </div>
  );
}