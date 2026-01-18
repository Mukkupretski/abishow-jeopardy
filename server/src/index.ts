import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let canAnswer: boolean = true;

io.on('connection', (socket) => {
  console.log(socket.id, "yhdisti");

  io.emit('asetanappi', canAnswer)
  socket.on('gitpush', (data: { opettaja: boolean }) => {
    console.log(data.opettaja ? "Opettaja" : "Opiskelija", "painoi nappia")
    if (!canAnswer) {
      console.log("Nappi oli pois käytöstä")
      return;
    }
    io.emit('gitpush', data);
  });
  socket.on('asetanappi', (data: { nappistatus: boolean }) => {
    console.log("Nappi aktivoitu")
    canAnswer = data.nappistatus;
    io.emit('asetanappi', data.nappistatus)
  });

  socket.on('disconnect', () => {
    console.log(socket.id, "menetti yhteyden");
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Palvelin päällä portissa ${PORT}`);
});
