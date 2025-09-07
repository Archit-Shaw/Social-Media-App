import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConversations } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';

const Conversation = ({ conversation, isActive }) => {
  const { currentUser } = useAuth();

  if (!conversation.otherParticipant) return null;

  const activeClasses = isActive ? 'bg-indigo-100' : 'hover:bg-gray-100';

  return (
    <Link
      to={`/messages/${conversation.otherParticipant._id}`}
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeClasses}`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex-shrink-0 overflow-hidden">
        {conversation.otherParticipant.profilePicture && (
          <img
            src={conversation.otherParticipant.profilePicture}
            alt={conversation.otherParticipant.username}
            className="w-full h-full object-cover rounded-full"
          />
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-bold text-gray-800 truncate">{conversation.otherParticipant.username}</p>
        <p className="text-sm text-gray-500 truncate">
          {conversation.lastMessage
            ? `${conversation.lastMessage.senderId === currentUser._id ? 'You: ' : ''}${conversation.lastMessage.message}`
            : 'No messages yet.'}
        </p>
      </div>
    </Link>
  );
};

const ConversationList = ({ conversations, activeConversationId }) => (
  <div className="flex flex-col h-full bg-white border-r">
    <div className="p-4 border-b">
      <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
    </div>
    <div className="flex-1 overflow-y-auto">
      {conversations.length > 0 ? (
        conversations.map((conv) => (
          <Conversation
            key={conv._id}
            conversation={conv}
            isActive={activeConversationId === conv.otherParticipant?._id}
          />
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">
          <p>You have no conversations yet. Start one from a user’s profile!</p>
        </div>
      )}
    </div>
  </div>
);

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { otherUserId } = useParams();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading conversations...</div>;
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[320px] flex-col">
        <ConversationList conversations={conversations} activeConversationId={otherUserId} />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="hidden md:block h-full">
          {otherUserId ? (
            <ChatWindow otherUserId={otherUserId} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden h-full">
          {otherUserId ? (
            <ChatWindow otherUserId={otherUserId} />
          ) : (
            <ConversationList conversations={conversations} activeConversationId={otherUserId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
