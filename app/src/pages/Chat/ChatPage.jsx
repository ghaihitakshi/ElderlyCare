import { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  subscribeToChatMessages, 
  unsubscribeFromChatMessages, 
  sendChatMessage, 
  initializeSocket 
} from '../../services/socket';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Mock contacts data for now
  useEffect(() => {
    // In a real app, fetch contacts from backend
    setContacts([
      { id: 'user1', firstName: 'Emma', lastName: 'Johnson', role: 'ELDERLY', unread: 2 },
      { id: 'user2', firstName: 'Robert', lastName: 'Smith', role: 'FAMILY', unread: 0 },
      { id: 'user3', firstName: 'David', lastName: 'Williams', role: 'VOLUNTEER', unread: 0 }
    ]);
    setLoading(false);
    
    // Initialize socket
    initializeSocket();
    
    // Clean up socket on unmount
    return () => {
      unsubscribeFromChatMessages();
    };
  }, []);
  
  // Load messages when a contact is selected
  useEffect(() => {
    if (selectedContact) {
      const fetchMessages = async () => {
        try {
          setLoading(true);
          const response = await chatService.getMessages(selectedContact.id);
          setMessages(response.data.messages || []);
          
          // Subscribe to messages for this contact
          subscribeToChatMessages((newMsg) => {
            if (
              (newMsg.senderId === selectedContact.id && newMsg.recipientId === currentUser.userId) ||
              (newMsg.senderId === currentUser.userId && newMsg.recipientId === selectedContact.id)
            ) {
              setMessages((prevMessages) => [...prevMessages, newMsg]);
            }
          });
        } catch (err) {
          console.error('Error fetching messages:', err);
          setError('Failed to load messages. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchMessages();
      
      // Mark this contact's messages as read
      setContacts((prevContacts) => 
        prevContacts.map((contact) => 
          contact.id === selectedContact.id ? { ...contact, unread: 0 } : contact
        )
      );
    }
    
    return () => {
      // Unsubscribe when changing contacts or unmounting
      unsubscribeFromChatMessages();
    };
  }, [selectedContact, currentUser?.userId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedContact) return;
    
    setSendingMessage(true);
    
    try {
      const messageData = {
        content: newMessage.trim(),
        senderId: currentUser.userId,
        recipientId: selectedContact.id,
      };
      
      // Optimistically add message to UI
      const tempMessage = {
        ...messageData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        pending: true,
      };
      
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage('');
      
      // Send message via API and socket
      await chatService.sendMessage(messageData);
      sendChatMessage(messageData);
      
      // Remove pending status
      setMessages((prev) => 
        prev.map((msg) => 
          msg._id === tempMessage._id ? { ...msg, pending: false } : msg
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove failed message from UI
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage?._id));
    } finally {
      setSendingMessage(false);
    }
  };
  
  // Format timestamp for display
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for message groups
  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long',
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach((message) => {
      const date = formatMessageDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }));
  };
  
  const messageGroups = groupMessagesByDate(messages);
  
  return (
    <div className="page-container h-screen flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="text-red-700">{error}</div>
        </div>
      )}
      
      <div className="flex flex-1 bg-white rounded-lg shadow overflow-hidden">
        {/* Contacts sidebar */}
        <div className="w-1/4 border-r border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Contacts</h2>
          </div>
          
          <div className="overflow-y-auto h-full">
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No contacts found</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <li 
                    key={contact.id}
                    className={`
                      p-4 hover:bg-gray-100 cursor-pointer
                      ${selectedContact?.id === contact.id ? 'bg-primary-50' : ''}
                    `}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="mr-3 h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                          {contact.firstName.charAt(0)}
                          {contact.lastName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </h3>
                          <p className="text-xs text-gray-500">{contact.role}</p>
                        </div>
                      </div>
                      
                      {contact.unread > 0 && (
                        <div className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {contact.unread}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-gray-200 flex items-center bg-white">
                <div className="mr-3 h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  {selectedContact.firstName.charAt(0)}
                  {selectedContact.lastName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedContact.role}</p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center text-gray-500">
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Send a message to start the conversation</p>
                    </div>
                  </div>
                ) : (
                  messageGroups.map(({ date, messages }) => (
                    <div key={date} className="mb-6">
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {date}
                        </div>
                      </div>
                      
                      {messages.map((message) => {
                        const isCurrentUser = message.senderId === currentUser.userId;
                        
                        return (
                          <div 
                            key={message._id}
                            className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`
                                max-w-3/4 rounded-lg px-4 py-2 
                                ${isCurrentUser 
                                  ? 'bg-primary-500 text-white' 
                                  : 'bg-white border border-gray-200 text-gray-800'}
                                ${message.pending ? 'opacity-70' : ''}
                              `}
                            >
                              <div className="text-sm">{message.content}</div>
                              <div 
                                className={`
                                  text-xs mt-1 
                                  ${isCurrentUser ? 'text-primary-100' : 'text-gray-500'}
                                `}
                              >
                                {formatMessageTime(message.createdAt)}
                                {message.pending && ' • Sending...'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input-field flex-1"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="btn-primary px-4 flex items-center justify-center"
                  >
                    {sendingMessage ? (
                      <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <PaperAirplaneIcon className="h-5 w-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-lg">Select a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 