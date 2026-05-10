import { Button, Empty, Flex, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import AddDocModal from '@/layout/AddDocModal';
import { useDocStore } from '@/store/useDocStore';

const { Text } = Typography;

export const Component = () => {
  const fetchDocsData = useDocStore((state) => state.fetchDocsData);

  return (
    <Flex justify="center" align="center" style={{ height: '100%' }}>
      <Empty
        image={<FileTextOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
        description={<Text type="secondary">选择左侧文档开始编辑，或创建新文档</Text>}
      >
        <AddDocModal onSuccess={fetchDocsData}>
          <Button type="primary" icon={<FileTextOutlined />}>
            创建文档
          </Button>
        </AddDocModal>
      </Empty>
    </Flex>
  );
};
