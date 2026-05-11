import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Flex,
  Layout,
  theme,
  Tree,
  Typography
} from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import AddDocModal from '../AddDocModal';
import { useDocStore } from '@/store/useDocStore';
import { getAvatarColor, getLocalStorage, removeLocalStorage } from '@/utils';

const { Sider } = Layout;
const { Text } = Typography;

const roleMap = {
  0: '创建者',
  1: '可编辑',
  2: '可预览'
};

const Index = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const { token } = theme.useToken();
  const selectedKeys = docId ? [docId] : [];
  const { username = '', email = '', id = '' } = getLocalStorage('user') || {};
  // doc 列表数据
  const { docsData, fetchDocsData, loading: docsLoading } = useDocStore();
  const myDocs = docsData.filter((doc) => doc.userId === doc.ownerId);
  const joinedDocs = docsData.filter((doc) => doc.userId !== doc.ownerId);

  const menuItems = [
    {
      key: 'logout',
      label: (
        <Text
          type="danger"
          onClick={() => {
            removeLocalStorage('user');
            removeLocalStorage('token');
            navigate('/login', { replace: true });
          }}
        >
          退出登录
        </Text>
      )
    }
  ];

  const treeData = [
    {
      key: 'my',
      title: `我创建的 (${myDocs.length})`,
      selectable: false,
      children: myDocs.map((doc) => ({
        key: doc.docId,
        title: (
          <Text ellipsis style={{ maxWidth: 140 }}>
            {doc.docTitle}
          </Text>
        )
      }))
    },
    {
      key: 'joined',
      title: `我参加的 (${joinedDocs.length})`,
      selectable: false,
      children: joinedDocs.map((doc) => ({
        key: doc.docId,
        title: (
          <Flex align="center" gap={8}>
            <Text ellipsis style={{ maxWidth: 140 }}>
              {doc.docTitle}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {roleMap[doc.role]}
            </Text>
          </Flex>
        )
      }))
    }
  ];

  useEffect(() => {
    fetchDocsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sider
      width={240}
      style={{
        background: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        padding: 8,
        height: '100%'
      }}
    >
      <Flex vertical gap={16} style={{ height: '100%' }}>
        <Flex gap={16}>
          <AddDocModal onSuccess={fetchDocsData}>
            <Button type="primary" icon={<PlusOutlined />} block>
              创建文档
            </Button>
          </AddDocModal>

          <Button
            shape="circle"
            icon={<ReloadOutlined />}
            onClick={fetchDocsData}
            loading={docsLoading}
          />
        </Flex>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          <ConfigProvider theme={{ token: { borderRadius: 0 } }}>
            <Tree
              defaultExpandedKeys={['my', 'joined']}
              treeData={treeData}
              selectedKeys={selectedKeys}
              selectable
              blockNode
              onSelect={(keys) => {
                if (keys.length > 0) {
                  navigate(`/edit/${keys[0]}`);
                } else {
                  navigate('/');
                }
              }}
            />
          </ConfigProvider>
        </div>

        <div style={{ paddingTop: 8, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
          <Dropdown menu={{ items: menuItems }} arrow>
            <Flex align="center" gap={8} style={{ height: 40, cursor: 'pointer' }}>
              <Avatar style={{ backgroundColor: getAvatarColor(username) }}>
                {username.charAt(0)}
              </Avatar>
              <Flex vertical style={{ width: '100%', flex: 1 }}>
                <Text copyable ellipsis style={{ fontSize: 14 }}>
                  {email}
                </Text>
                <Text copyable ellipsis type="secondary" style={{ fontSize: 12 }}>
                  {id}
                </Text>
              </Flex>
            </Flex>
          </Dropdown>
        </div>
      </Flex>
    </Sider>
  );
};

export default Index;
