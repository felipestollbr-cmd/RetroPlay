import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

declare const EJS: any;

export default function MultiplayerGame() {
  const { gameId } = useParams(); // ex: 'atari-pong'
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [netplayStatus, setNetplayStatus] = useState('disconnected');
  const { user } = useAuth();
  const ejsRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const playerId = user?.id || 'anon-' + Math.random();

  // Criar sala
  const createRoom = async () => {
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'create-room',
        playerId,
        gameId,
      }));
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'room-created') {
        setRoomId(msg.roomId);
        setIsHost(true);
        setNetplayStatus('waiting');
        // Inicia o EmulatorJS em modo host
        initEmulator(true, msg.roomId);
      } else if (msg.type === 'player-joined') {
        setPlayers(prev => [...prev, msg.playerId]);
        startNetplay(msg.playerId);
      }
    };
  };

  // Entrar em sala existente
  const joinRoom = (existingRoomId: string) => {
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'join-room',
        roomId: existingRoomId,
        playerId,
        gameId,
      }));
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'joined') {
        setRoomId(msg.roomId);
        setIsHost(false);
        setNetplayStatus('connected');
        initEmulator(false, msg.roomId);
        // Inicia conexão WebRTC com o host
        connectToHost(msg.hostId);
      } else if (msg.type === 'signal') {
        handleSignal(msg.signal, msg.from);
      }
    };
  };

  const initEmulator = (host: boolean, room: string) => {
    if (!ejsRef.current) return;
    const options = {
      gameUrl: `/roms/${gameId}.bin`, // coloque suas ROMs na pasta public/roms
      system: 'Atari2600',
      netplay: {
        enabled: true,
        host: host,
        roomId: room,
        playerId: playerId,
        stunServers: ['stun:stun.l.google.com:19302'],
        turnServers: [], // opcional
        onSignal: (signal: any, toPlayerId: string) => {
          wsRef.current?.send(JSON.stringify({
            type: 'netplay-signal',
            roomId: room,
            targetPlayerId: toPlayerId,
            signal,
          }));
        },
        onPeerConnected: () => setNetplayStatus('playing'),
        onPeerDisconnected: () => setNetplayStatus('disconnected'),
      },
    };
    EJS?.start(ejsRef.current, options);
  };

  const connectToHost = (hostId: string) => {
    // O EmulatorJS já gerencia a conexão via netplay.onSignal
    // Só precisamos garantir que o host foi informado
    console.log('Connecting to host', hostId);
  };

  const handleSignal = (signal: any, from: string) => {
    // Encaminha sinal para o EmulatorJS interno (se necessário)
    // O EmulatorJS normalmente lida sozinho, mas podemos expor via EJS.netplay.signal(signal)
    if (EJS && EJS.netplay) {
      EJS.netplay.signal(signal, from);
    }
  };

  const startNetplay = (otherPlayerId: string) => {
    // Host inicia a partida após conexão
    if (EJS && EJS.netplay) {
      EJS.netplay.start();
      setNetplayStatus('playing');
    }
  };

  return (
    <div>
      <h1>Multiplayer - {gameId}</h1>
      {!roomId ? (
        <div>
          <button onClick={createRoom}>Hospedar partida</button>
          <input placeholder="Código da sala" id="roomInput" />
          <button onClick={() => joinRoom((document.getElementById('roomInput') as HTMLInputElement).value)}>
            Entrar na sala
          </button>
        </div>
      ) : (
        <div>
          <p>Sala: {roomId} | Status: {netplayStatus}</p>
          {isHost && <p>Aguardando outro jogador... {players.length > 0 && 'Conectado!'}</p>}
          <div ref={ejsRef} style={{ width: '800px', height: '600px' }}></div>
        </div>
      )}
    </div>
  );
}