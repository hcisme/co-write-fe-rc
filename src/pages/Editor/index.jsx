import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Badge, Flex, Space, Typography } from 'antd';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCollaborationV2 } from '@/hooks';
import { getLocalStorage, stringToColor } from '@/utils';
import { EditorToolbar, GlobalLoading } from '@/components';
import './index.less';

const { Text } = Typography;

export const Component = () => {
  const { docId } = useParams();
  const user = useMemo(() => getLocalStorage('user') || {}, []);
  const token = useMemo(() => getLocalStorage('token'), []);
  const { ydoc, provider, status } = useCollaborationV2({
    docId,
    userId: user.id,
    username: user.username,
    token
  });

  if (!ydoc || !provider) {
    return <GlobalLoading />;
  }

  return (
    <TiptapEditor
      ydoc={ydoc}
      provider={provider}
      status={status}
      userId={user.id}
      username={user.username}
    />
  );
};

const TiptapEditor = ({ ydoc, provider, status, userId, username }) => {
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
      ]
    },
    [ydoc, provider]
  );

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
          在线人数: {provider?.awareness.getStates().size || 0}
        </Text>
      </Flex>
    </div>
  );
};
