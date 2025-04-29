const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pako = require('pako');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Permitir todas las conexiones (ajusta según sea necesario)
  },
});

// Almacenamiento temporal de las páginas por sala
const roomPages = new Map();

// Manejo de conexiones
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Unirse a una sala
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Cliente ${socket.id} se unió a la sala: ${roomId}`);
    
    // Si la sala no existe, inicializarla
    if (!roomPages.has(roomId)) {
      roomPages.set(roomId, {
        pages: ['<p>Page 1</p>'],
        pagescss: ['<style>body{background-color: #fff;}</style>']
      });
    }
  });

  // Recibir actualizaciones del editor
  socket.on('editor-update', (data) => {
    console.log('Datos recibidos:', data);

    // Reenviar los datos a todos los clientes en la misma sala
    socket.to(data.roomId).emit('editor-update', data);
  });

  // Manejar cambios de página
  socket.on('page-change', (data) => {
    const { roomId, pageIndex, totalPages, pages, pagescss } = data;
    
    // Actualizar el estado de las páginas en la sala
    if (roomPages.has(roomId)) {
      const roomData = roomPages.get(roomId);
      if (totalPages > roomData.pages.length) {
        roomData.pages = pages;
        roomData.pagescss = pagescss;
        roomPages.set(roomId, roomData);
      }
    }

    // Reenviar los datos a todos los clientes en la misma sala
    socket.to(roomId).emit('page-change', {
      roomId,
      pageIndex,
      totalPages,
      pages: roomPages.get(roomId).pages,
      pagescss: roomPages.get(roomId).pagescss
    });
  });

  // Manejo de desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar el servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 