import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Avatar, Badge, Button, Card, Col, Flex, Row, Tooltip, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useCollaborationV2 } from '@/hooks';
import { getLocalStorage } from '@/utils';
import { GlobalLoading } from '@/components';
import TiptapEditor from './TiptapEditor';
import AddCollaboratorModal from './AddCollaboratorModal';
import { useRequest } from 'ahooks';
import { checkPermission } from '@/service/docService';
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
    email: user.email,
    token
  });
  const [users, setUsers] = useState([]);

  const { data: { data: permissionData = {} } = {} } = useRequest(
    () => checkPermission({ docId }),
    {
      refreshDeps: [docId]
    }
  );

  useEffect(() => {
    if (!provider) return;

    const updateUsers = () => {
      const states = provider.awareness.getStates();
      const userList = [];
      states.forEach((state, clientId) => {
        if (state.user) {
          userList.push({ clientId, ...state.user });
        }
      });
      const uniqueUsers = Array.from(new Map(userList.map((u) => [u.name, u])).values());
      setUsers(uniqueUsers);
    };

    provider.awareness.on('change', updateUsers);
    updateUsers();

    return () => {
      provider.awareness.off('change', updateUsers);
    };
  }, [provider]);

  if (!ydoc || !provider) {
    return <GlobalLoading />;
  }

  return (
    <Row style={{ height: '100%' }}>
      <Col span={20}>
        <TiptapEditor
          ydoc={ydoc}
          provider={provider}
          status={status}
          userId={user.id}
          username={user.username}
          onlineCount={users.length}
          role={permissionData.role}
        />
      </Col>

      <Col span={4}>
        <Flex
          vertical
          gap={16}
          style={{ height: '100%', padding: 16, borderLeft: '1px solid #f0f0f0' }}
        >
          <Flex justify="space-between" align="center">
            <Badge count={users.length} size="small" offset={[8, 0]}>
              <Text strong>在线用户</Text>
            </Badge>
            {permissionData.role !== 2 && (
              <Tooltip title="添加协作者">
                <AddCollaboratorModal>
                  <Button type="text" icon={<UserAddOutlined />} size="small" />
                </AddCollaboratorModal>
              </Tooltip>
            )}
          </Flex>

          <Flex vertical gap={12} style={{ flex: 1, overflowY: 'auto' }}>
            {users.map((u) => {
              const isSelf = u.email === user.email;
              const card = (
                <Card key={u.clientId} size="small" hoverable>
                  <Flex align="center" gap={8}>
                    <Avatar size="small" style={{ backgroundColor: u.color }}>
                      {u.name.charAt(0)}
                    </Avatar>
                    <Flex vertical>
                      <Text ellipsis>{u.name}</Text>
                      <Text ellipsis type="secondary" style={{ fontSize: 12 }}>
                        {u.email}
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              );
              return isSelf ? (
                <div key={u.clientId} style={{ paddingRight: 12 }}>
                  <Badge.Ribbon text="自己">{card}</Badge.Ribbon>
                </div>
              ) : (
                card
              );
            })}
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
};
