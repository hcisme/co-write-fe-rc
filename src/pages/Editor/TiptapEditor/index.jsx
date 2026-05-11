import { useEffect } from 'react';
import { Badge, Flex, Space, Typography } from 'antd';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { stringToColor } from '@/utils';
import { EditorToolbar } from '@/components';

const { Text } = Typography;

const Index = ({ ydoc, provider, status, userId, username, onlineCount, role }) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false
        }),
        Collaboration.configure({
          document: ydoc
        }),
        CollaborationCursor.configure({
          provider: provider,
          user: {
            name: username,
            color: stringToColor(userId)
          }
        })
      ],
      editable: role !== 2
    },
    [ydoc, provider, role]
  );

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(role !== 2);
    }
  }, [editor, role]);

  if (!editor) return null;

  return (
    <div className="editor-container">
      <EditorToolbar editor={editor} />

      <div className="editor-content-area">
        <EditorContent editor={editor} />
      </div>

      <Flex className="status-footer" justify="space-between" align="center">
        <Space align="center">
          <Badge status={status === 'connected' ? 'success' : 'error'} />
          <Text type={status === 'connected' ? 'success' : 'danger'} style={{ fontSize: 12 }}>
            {status === 'connected' ? '服务已连接' : '正在尝试连接服务器...'}
          </Text>
        </Space>
        <Text type="secondary" style={{ fontSize: 12 }}>
          在线人数: {onlineCount}
        </Text>
      </Flex>
    </div>
  );
};

export default Index;
