const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const rooms = new Map(); // roomId -> { hostId, players: [ws], gameId, password? }

const server = app.listen(3001, () => console.log('Netplay server on 3001'));
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  let currentRoom = null;
  let playerId = null;

  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    switch (msg.type) {
      case 'create-room':
        const roomId = uuidv4().slice(0, 8);
        rooms.set(roomId, {
          hostId: msg.playerId,
          players: [{ ws, playerId: msg.playerId }],
          gameId: msg.gameId,
          password: msg.password || null,
        });
        ws.send(JSON.stringify({ type: 'room-created', roomId }));
        currentRoom = roomId;
        playerId = msg.playerId;
        break;

      case 'join-room':
        const room = rooms.get(msg.roomId);
        if (!room) return ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
        if (room.password && room.password !== msg.password) return ws.send(JSON.stringify({ type: 'error', message: 'Wrong password' }));
        room.players.push({ ws, playerId: msg.playerId });
        ws.send(JSON.stringify({ type: 'joined', roomId: msg.roomId, hostId: room.hostId }));
        // Notify host that a new player joined
        const hostWs = room.players.find(p => p.playerId === room.hostId)?.ws;
        if (hostWs) hostWs.send(JSON.stringify({ type: 'player-joined', playerId: msg.playerId }));
        currentRoom = msg.roomId;
        playerId = msg.playerId;
        break;

      case 'netplay-signal':
        // Forward WebRTC signaling data to the other player
        const targetRoom = rooms.get(msg.roomId);
        if (targetRoom) {
          const otherPlayer = targetRoom.players.find(p => p.playerId === msg.targetPlayerId);
          if (otherPlayer) otherPlayer.ws.send(JSON.stringify({
            type: 'signal',
            signal: msg.signal,
            from: playerId,
          }));
        }
        break;

      case 'leave-room':
        if (currentRoom) {
          const room = rooms.get(currentRoom);
          if (room) {
            room.players = room.players.filter(p => p.playerId !== playerId);
            if (room.players.length === 0) rooms.delete(currentRoom);
            else {
              // Notify others
              room.players.forEach(p => p.ws.send(JSON.stringify({ type: 'player-left', playerId })));
            }
          }
        }
        break;
    }
  });

  ws.on('close', () => {
    if (currentRoom) {
      const room = rooms.get(currentRoom);
      if (room) {
        room.players = room.players.filter(p => p.ws !== ws);
        if (room.players.length === 0) rooms.delete(currentRoom);
        else {
          room.players.forEach(p => p.ws.send(JSON.stringify({ type: 'player-left', playerId })));
        }
      }
    }
  });
});