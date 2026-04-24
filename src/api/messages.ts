import { api } from './client';

export type PostStatus = 'POSTED' | 'IN_PROGRESS' | 'PAID' | 'CANCELLED';
export type MessageType = 'TEXT' | 'IMAGE';

export interface CounterpartyPreview {
  id: string;
  firstName: string;
  lastName: string;
  avatarKey: string | null;
  avatarUrl: string | null;
}

export interface ConversationPostPreview {
  id: string;
  budget: string;
  status: PostStatus;
  category: { id: string; name: string; iconKey: string };
}

export interface Conversation {
  id: string;
  buyerId: string;
  shopperId: string;
  postId: string;
  lastMessageAt: string;
  hiddenFromBuyer: boolean;
  hiddenFromShopper: boolean;
  createdAt: string;
  buyer: CounterpartyPreview;
  shopper: CounterpartyPreview;
  post: ConversationPostPreview;
  /** Optional last-message preview the backend may attach for the list view. */
  lastMessage?: MessagePreview | null;
  /** Number of unread messages from the counterparty. */
  unreadCount?: number;
}

export interface MessagePreview {
  id: string;
  body: string | null;
  type: MessageType;
  senderId: string;
  createdAt: string;
}

export interface Upload {
  id: string;
  key: string;
  url: string;
  mime: string;
  sizeBytes: number;
}

export interface MessageAttachment {
  id: string;
  uploadId: string;
  upload: Upload;
}

export interface Message extends MessagePreview {
  conversationId: string;
  readAt: string | null;
  attachments: MessageAttachment[];
}

export interface SendMessageBody {
  body?: string;
  uploadIds?: string[];
}

export interface OpenConversationBody {
  postId: string;
  counterpartyId: string;
}

export interface ListMessagesQuery {
  before?: string;
  limit?: number;
}

const qs = (q?: ListMessagesQuery): string => {
  if (!q) return '';
  const parts: string[] = [];
  if (q.before) parts.push(`before=${encodeURIComponent(q.before)}`);
  if (q.limit !== undefined) parts.push(`limit=${q.limit}`);
  return parts.length ? `?${parts.join('&')}` : '';
};

export const messagesApi = {
  list: (): Promise<Conversation[]> => api.get<Conversation[]>('/conversations'),

  open: (body: OpenConversationBody): Promise<Conversation> => api.post<Conversation>('/conversations', body),

  findOne: (id: string): Promise<Conversation> => api.get<Conversation>(`/conversations/${id}`),

  listMessages: (id: string, query?: ListMessagesQuery): Promise<Message[]> =>
    api.get<Message[]>(`/conversations/${id}/messages${qs(query)}`),

  send: (id: string, body: SendMessageBody): Promise<Message> =>
    api.post<Message>(`/conversations/${id}/messages`, body),

  markRead: (id: string, upToMessageId: string): Promise<void> =>
    api.post<void>(`/conversations/${id}/read`, { upToMessageId }),
};

export const blocksApi = {
  list: (): Promise<{ blockedId: string; createdAt: string }[]> =>
    api.get<{ blockedId: string; createdAt: string }[]>('/blocks'),

  block: (blockedId: string): Promise<void> => api.post<void>('/blocks', { blockedId }),

  unblock: (userId: string): Promise<void> => api.delete<void>(`/blocks/${userId}`),
};
