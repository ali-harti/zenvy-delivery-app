import { io, Socket } from 'socket.io-client';
import { ENV } from '@config/env';
import { SOCKET_EVENTS } from './events';
import { storage } from '@utils/storage';

class SocketService {
    private socket: Socket | null = null;
    private isConnecting = false;

    async connect() {
        if (this.socket?.connected || this.isConnecting) return;

        const token = await storage.getToken();
        if (!token) {
            console.warn('SocketService: No token found, cannot connect');
            return;
        }

        this.isConnecting = true;

        this.socket = io(ENV.SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            forceNew: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log('SocketService: Connected', this.socket?.id);
            this.isConnecting = false;
        });

        this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
            console.log('SocketService: Disconnected', reason);
            this.isConnecting = false;
        });

        this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
            console.error('SocketService: Connection Error', err.message);
            this.isConnecting = false;
        });

        // Global Event Listener removed for PII safety compliance
        // this.socket.onAny((event, ...args) => console.log(`[Socket] ${event}`));
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Subscribe to specific events
    on(event: string, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (...args: any[]) => void) {
        this.socket?.off(event, callback);
    }

    get connected() {
        return this.socket?.connected || false;
    }
}

export const socketService = new SocketService();
