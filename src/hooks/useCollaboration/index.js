import { useEffect, useReducer, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { stringToColor } from '@/utils';

const getWsUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws-api`;
};

const useCollaboration = ({ docId, userId, username, token }) => {
  const [status, setStatus] = useState('connecting');
  const [ydoc, setYdoc] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const doc = new Y.Doc();
    const p = new WebsocketProvider(getWsUrl(), docId, doc, {
      params: { userId, token },
      connect: true
    });

    const handleStatus = ({ status }) => setStatus(status);
    p.on('status', handleStatus);

    queueMicrotask(() => {
      setYdoc(doc);
      setProvider(p);
    });

    return () => {
      p.off('status', handleStatus);
      p.destroy();
      doc.destroy();
      setYdoc(null);
      setProvider(null);
    };
  }, [docId, userId, token]);

  useEffect(() => {
    if (!provider) return;
    provider.awareness.setLocalStateField('user', {
      name: username,
      color: stringToColor(userId)
    });
  }, [provider, username, userId]);

  return { ydoc, provider, status };
};

const collaborationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INSTANCE':
      return { ...state, ydoc: action.ydoc, provider: action.provider };
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'RESET':
      return { ...state, ydoc: null, provider: null, status: 'connecting' };
    default:
      return state;
  }
};

export const useCollaborationV2 = ({ docId, userId, username, token }) => {
  const [state, dispatch] = useReducer(collaborationReducer, {
    ydoc: null,
    provider: null,
    status: 'connecting'
  });

  useEffect(() => {
    const doc = new Y.Doc();
    const p = new WebsocketProvider(getWsUrl(), docId, doc, {
      params: { userId, token },
      connect: true
    });
    dispatch({ type: 'SET_INSTANCE', ydoc: doc, provider: p });

    const handleStatus = ({ status }) => {
      dispatch({ type: 'SET_STATUS', status });
    };
    p.on('status', handleStatus);

    return () => {
      p.off('status', handleStatus);
      p.destroy();
      doc.destroy();
      dispatch({ type: 'RESET' });
    };
  }, [docId, userId, token]);

  useEffect(() => {
    if (!state.provider) return;
    state.provider.awareness.setLocalStateField('user', {
      name: username,
      color: stringToColor(userId)
    });
  }, [state.provider, username, userId]);

  return state;
};

export default useCollaboration;
