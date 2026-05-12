import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Avatar, Badge, Button, Card, Col, Flex, Row, Tooltip, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useCollaborationV2 } from '@/hooks';
import { getLocalStorage, roleMap, stringToColor } from '@/utils';
import { GlobalLoading } from '@/components';
import TiptapEditor from './TiptapEditor';
import EditCollaboratorModal from './EditCollaboratorDrawer';
import { checkPermission, getDocMember } from '@/service/docService';
import { useDocStore } from '@/store/useDocStore';
import './index.less';

const { Text } = Typography;

export const Component = () => {
  const { docId } = useParams();
  const fetchDocsData = useDocStore((state) => state.fetchDocsData);
  const user = useMemo(() => getLocalStorage('user') || {}, []);
  const token = useMemo(() => getLocalStorage('token'), []);
  const { ydoc, provider, status } = useCollaborationV2({
    docId,
    userId: user.id,
    username: user.username,
    email: user.email,
    token
  });
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

  const { data: { data: permissionData = {} } = {} } = useRequest(
    () => checkPermission({ docId }),
    {
      refreshDeps: [docId]
    }
  );
  const { data: { data: memberList } = {}, runAsync: fetchMemberList } = useRequest(
    () => getDocMember({ docId }),
    {
      refreshDeps: [docId]
    }
  );

  useEffect(() => {
    if (!provider) return;

    const updateUsers = () => {
      const states = provider.awareness.getStates();
      const currentOnlineIds = new Set();
      states.forEach((state) => {
        if (state.user && state.user.userId) {
          currentOnlineIds.add(state.user.userId);
        }
      });
      setOnlineUserIds((prev) => {
        if (prev.size !== currentOnlineIds.size) return currentOnlineIds;
        for (let id of currentOnlineIds) {
          if (!prev.has(id)) return currentOnlineIds;
        }
        return prev;
      });
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
          email={user.email}
          onlineCount={onlineUserIds.size}
          role={permissionData.role}
          onRoleChange={() => {
            fetchMemberList();
            fetchDocsData();
          }}
        />
      </Col>

      <Col span={4}>
        <Flex
          vertical
          gap={16}
          style={{ height: '100%', padding: 16, borderLeft: '1px solid #f0f0f0' }}
        >
          <Flex justify="space-between" align="center">
            <Badge count={onlineUserIds.size} size="small" offset={[8, 0]}>
              <Text strong>成员</Text>
            </Badge>
            {permissionData.role !== 2 && (
              <Tooltip title="添加协作者">
                <EditCollaboratorModal edit={false}>
                  <Button type="text" icon={<UserAddOutlined />} size="small" />
                </EditCollaboratorModal>
              </Tooltip>
            )}
          </Flex>

          <Flex vertical gap={8} style={{ flex: 1, overflow: 'hidden auto', padding: '4px' }}>
            {(memberList || []).map((item) => {
              const isOnLine = onlineUserIds.has(item.userId);
              const cardContent = (
                <div
                  key={item.userId}
                  style={{
                    paddingRight: 12,
                    position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      borderRadius: 6,
                      zIndex: 1,
                      pointerEvents: 'none',
                      opacity: isOnLine ? 0 : 1,
                      visibility: isOnLine ? 'hidden' : 'visible',
                      transition: 'opacity 0.4s ease, visibility 0.4s ease'
                    }}
                  />

                  <Badge.Ribbon
                    text={roleMap[item.role]}
                    style={{
                      opacity: isOnLine ? 1 : 0.7,
                      transition: 'opacity 0.4s ease'
                    }}
                  >
                    <Card
                      size="small"
                      hoverable
                      style={{
                        opacity: isOnLine ? 1 : 0.6,
                        filter: isOnLine ? 'grayscale(0%)' : 'grayscale(100%)',
                        transition: 'all 0.4s ease',
                        border: isOnLine ? '1px solid #d9d9d9' : '1px solid #f0f0f0'
                      }}
                    >
                      <Flex align="center" gap={8}>
                        <Avatar
                          size="small"
                          style={{
                            flexShrink: 0,
                            backgroundColor: stringToColor(item.userId),
                            transform: isOnLine ? 'scale(1)' : 'scale(0.9)',
                            transition: 'transform 0.4s ease'
                          }}
                        >
                          {item.username.charAt(0)}
                        </Avatar>
                        <Flex vertical style={{ minWidth: 0 }}>
                          <Text ellipsis title={item.username} strong={isOnLine}>
                            {item.username}
                          </Text>
                          <Text
                            ellipsis
                            type="secondary"
                            style={{ fontSize: 12 }}
                            title={item.email}
                          >
                            {item.email}
                          </Text>
                        </Flex>
                      </Flex>
                    </Card>
                  </Badge.Ribbon>
                </div>
              );

              return item.role === 0 ? (
                cardContent
              ) : (
                <EditCollaboratorModal
                  key={item.userId}
                  edit={true}
                  initialValues={{ userId: item.userId, role: item.role }}
                  onSuccess={() => {
                    fetchMemberList();
                    fetchDocsData();
                  }}
                >
                  {cardContent}
                </EditCollaboratorModal>
              );
            })}
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
};
