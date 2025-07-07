import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://192.168.1.18:8081';

interface ExtendedSocket extends Socket {
  on(event: string, callback: (...args: any[]) => void): this;
  off(event?: string, callback?: (...args: any[]) => void): this;
}

class SocketService {
  private socket: ExtendedSocket;
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 5;

  constructor() {
    this.socket = io(SOCKET_SERVER_URL) as ExtendedSocket;

    this.socket.on('connect', () => {
      console.log('Mobile Conectado ao servidor Socket.IO');
      this.reconnectAttempts = 0; // Resetar o número de tentativas após uma conexão bem-sucedida
    });

    this.socket.on('disconnect', () => {
      console.log('Mobile Desconectado do servidor Socket.IO. Tentando reconectar...');
      this.reconnect();
    });
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      // Incrementa o número de tentativas de reconexão
      this.reconnectAttempts++;

      // Tenta reconectar após um intervalo de tempo
      setTimeout(() => {
        console.log(`Tentativa de reconexão ${this.reconnectAttempts} de ${this.maxReconnectAttempts}`);
        this.socket.connect();
      }, 3000); // Intervalo de 3 segundos (ajuste conforme necessário)
    } else {
      console.log('Número máximo de tentativas de reconexão atingido. Parando as tentativas.');
    }
  }

  sendMessage(messages: string) {
    this.socket.emit('nome_do_evento', messages);
  }

  onCustomEvent(callback: (data: any) => void) {
    this.socket.on('evento_personalizado', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
    return this;
  }

  off(event?: string, callback?: (...args: any[]) => void) {
    if (event) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    } else {
      this.socket.removeAllListeners(); // Remove todos os ouvintes se nenhum evento for fornecido
    }
    return this;
  }
}

const socketService = new SocketService();
socketService.on('customEvent', (data) => {
  console.log('Received custom event:', data);
});

export default socketService;
