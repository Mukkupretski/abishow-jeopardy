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

type NappiData = { opet: boolean, abit: boolean, yleinen: boolean }


let canAnswer: NappiData = { opet: false, abit: false, yleinen: false };

io.on('connection', (socket) => {
  console.log(socket.id, "yhdisti");

  io.emit('asetanappi', canAnswer)
  socket.on('gitpush', (data: { opettaja: boolean }) => {
    console.log(data.opettaja ? "Opettaja" : "Opiskelija", "painoi nappia")
    if (!canAnswer.yleinen) {
      console.log("Nappi oli pois käytöstä")
      return;
    }
    const final: boolean = (!canAnswer.opet || !canAnswer.abit)
    canAnswer = { opet: !data.opettaja, abit: data.opettaja, yleinen: false };
    io.emit('gitpush', { ...data, final: final });
    io.emit('asetanappi', canAnswer)
  });
  socket.on('asetanappi', (data: NappiData) => {
    console.log("Nappi toggled")
    canAnswer = data
    io.emit('asetanappi', canAnswer)
  });
  socket.on('asetanappiyleinen', (data: boolean) => {
    console.log("Nappi toggled")
    canAnswer = { ...canAnswer, yleinen: data }
    io.emit('asetanappi', canAnswer)
  });

  socket.on('disconnect', () => {
    console.log(socket.id, "menetti yhteyden");
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Palvelin päällä portissa ${PORT}`);
});
