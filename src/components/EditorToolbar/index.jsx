import { useEffect } from 'react';
import { Button, Divider, Flex, Tooltip } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  UndoOutlined,
  RedoOutlined
} from '@ant-design/icons';
import { useUpdate } from 'ahooks';
import './index.less';

const Index = ({ editor }) => {
  const update = useUpdate();

  const toggle = (action) => action(editor.chain().focus()).run();

  const buttons = [
    { icon: <BoldOutlined />, tip: '加粗', action: (e) => e.toggleBold(), active: 'bold' },
    { icon: <ItalicOutlined />, tip: '斜体', action: (e) => e.toggleItalic(), active: 'italic' },
    {
      icon: <StrikethroughOutlined />,
      tip: '删除线',
      action: (e) => e.toggleStrike(),
      active: 'strike'
    },
    {
      label: 'H1',
      tip: '标题1',
      action: (e) => e.toggleHeading({ level: 1 }),
      active: 'heading',
      params: { level: 1 }
    },
    {
      label: 'H2',
      tip: '标题2',
      action: (e) => e.toggleHeading({ level: 2 }),
      active: 'heading',
      params: { level: 2 }
    },
    {
      icon: <UnorderedListOutlined />,
      tip: '无序列表',
      action: (e) => e.toggleBulletList(),
      active: 'bulletList'
    },
    {
      icon: <OrderedListOutlined />,
      tip: '有序列表',
      action: (e) => e.toggleOrderedList(),
      active: 'orderedList'
    },
    { label: '引用', tip: '引用', action: (e) => e.toggleBlockquote(), active: 'blockquote' },
    {
      icon: <CodeOutlined />,
      tip: '代码块',
      action: (e) => e.toggleCodeBlock(),
      active: 'codeBlock'
    }
  ];

  useEffect(() => {
    if (!editor) return;

    const handler = () => {
      update();
    };

    editor.on('transaction', handler);

    return () => {
      editor.off('transaction', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <Flex className="editor-toolbar" align="center" gap="small" wrap>
      {buttons.map((btn, index) => (
        <Tooltip key={index} title={btn.tip}>
          <Button
            type="text"
            size="small"
            icon={btn.icon}
            className={editor.isActive(btn.active, btn.params || {}) ? 'is-active' : ''}
            onClick={() => {
              toggle(btn.action);
              update();
            }}
          >
            {btn.label}
          </Button>
        </Tooltip>
      ))}

      <Divider orientation="vertical" style={{ height: 20 }} />

      <Tooltip title="撤销">
        <Button
          type="text"
          size="small"
          disabled={!editor.can().undo()}
          icon={<UndoOutlined />}
          onClick={() => editor.chain().focus().undo().run()}
        />
      </Tooltip>
      <Tooltip title="重做">
        <Button
          type="text"
          size="small"
          disabled={!editor.can().redo()}
          icon={<RedoOutlined />}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </Tooltip>
    </Flex>
  );
};

export default Index;
