export interface Album {
  id: string;
  name: string;
  totalFigurinhas: number;
  coverUrl?: string;
  isDefault: boolean;
}

export interface Figurinha {
  id: string;
  albumId: string;
  numero: string;
  nome: string;
  imagemUrl?: string;
  raridade: 'COMUM' | 'RARA' | 'ULTRA_RARA';
  album: Pick<Album, 'id' | 'name'>;
  category: { id: string; name: string } | null;
}

export interface InventoryItem {
  id: string;
  quantity: number;
  status: 'TENHO' | 'REPETIDA' | 'FALTANTE';
  figurinha: Figurinha;
}

export interface InventoryResponse {
  tenho: InventoryItem[];
  repetidas: InventoryItem[];
  faltantes: Figurinha[];
}

export interface TradeMatch {
  type: 'PERFEITA' | 'PARCIAL' | 'GRUPO';
  user: { id: string; name: string; lat?: number | null; lng?: number | null };
  theyHave: Array<{ figurinhaId: string; numero: string; nome: string }>;
  theyWant: Array<{ figurinhaId: string; numero: string; nome: string }>;
  distanceKm?: number;
}

export interface Trade {
  id: string;
  status: 'PENDENTE' | 'ACEITA' | 'REJEITADA' | 'CANCELADA';
  proposer: { id: string; name: string };
  receiver: { id: string; name: string };
  tradeItems: Array<{
    id: string;
    direction: 'OFFER' | 'REQUEST';
    userId: string;
    figurinha: { numero: string; nome: string };
  }>;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  lat?: number;
  lng?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface ChatPreview {
  id: string;
  otherUser: { id: string; name: string };
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}
