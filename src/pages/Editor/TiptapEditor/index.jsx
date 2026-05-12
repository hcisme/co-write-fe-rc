import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { App, Badge, Flex, Space, Typography } from 'antd';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { stringToColor } from '@/utils';
import { EditorToolbar } from '@/components';

const { Text } = Typography;

const Index = ({ ydoc, provider, status, userId, username, onlineCount, role, onRoleChange }) => {
  const { message } = App.useApp();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!provider) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ROLE_UPDATED') {
          const newRole = data.role;
          // 实时切换编辑器状态
          editor.setEditable(newRole !== 2);
          message.info(`您的权限已更新为: ${newRole === 1 ? '编辑' : '只读'}`, 5);
        }

        if (data.type === 'AUTH_REVOKED') {
          message.error('您已被移除协作，即将退出', 5);
          navigate('/');
        }
        onRoleChange?.();
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // 忽略
      }
    };

    provider.ws.addEventListener('message', handleMessage);
    return () => provider.ws.removeEventListener('message', handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, editor]);

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
