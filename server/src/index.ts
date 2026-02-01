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

type NappiData = { vastanneet: string[], yleinen: boolean }
const OSALLISTUJAT = 3


let canAnswer: NappiData = { vastanneet: [], yleinen: false };

io.on('connection', (socket) => {
  console.log(socket.id, "yhdisti");
  io.emit('asetanappi', canAnswer)
  socket.on('gitpush', (data: { rooli: string }) => {
    console.log(data.rooli, "painoi nappia")
    if (!canAnswer.yleinen) {
      console.log("Nappi oli pois käytöstä")
      return;
    }
    if (canAnswer.vastanneet.find(v => v == data.rooli)) {
      console.log(data.rooli + " on jo pinanut nappia")
      return;
    }
    canAnswer = { vastanneet: [...canAnswer.vastanneet, data.rooli], yleinen: false };
    io.emit('gitpush', { ...data, final: canAnswer.vastanneet.length == OSALLISTUJAT });
    if (canAnswer.vastanneet.length == OSALLISTUJAT) {
      canAnswer = { vastanneet: [], yleinen: false }
    }
    io.emit('asetanappi2', canAnswer)
  });
  socket.on("vapautakaikki", () => {
    canAnswer = { vastanneet: [], yleinen: true }
    console.log(canAnswer)
    io.emit('asetanappi2', canAnswer)

  })
  // FIXME: HUOM. poistettiin asetanappiyleinen
  socket.on('asetanappi', (data: { on: boolean }) => {
    console.log(canAnswer)
    console.log("here")
    canAnswer = { ...canAnswer, yleinen: data.on }
    io.emit('asetanappi2', canAnswer)
  });

  socket.on('disconnect', () => {
    console.log(socket.id, "menetti yhteyden");
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Palvelin päällä portissa ${PORT}`);
});
