const express = require('express');
const app = express();
const mediasoup = require('mediasoup');
const { createServer } = require('http');
const { Server } = require('socket.io');
const config = require('./config/config');
const createWorkers = require('./createWorkers');

app.use(express.static('public'));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:${config.port}`,
    // methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true
  }
});

// our global
// init workers, it's where our mediasoup workers will live
let workers = null;

//init router, its where only 1 router will live
let router = null;

const initMediasoup = async () => {
  workers = await createWorkers(); // function call
  // console.log(workers)

  // we just take only one workers ==> we can run a forEach loop for all workers
  router = await workers[0].createRouter({
    mediaCodecs: config.routerMediaCodecs
  })
};

initMediasoup(); // build our mediasoup server/sfu


io.on('connection', (socket) => {
  console.log(socket.id + 'user connected');
  let thisClientProducerTransport = null;

  socket.on('getRtpCap', (ack) => {

    // ack is a callback to run, the will send the args
    // back to the client
    ack(router.rtpCapabilities);
  });


  socket.on('create-producer-transport', async (ack) => {
    // create a transport! A producer transport
    thisClientProducerTransport = await router.createWebRtcTransport({
      enableUdp: true,
      enableTcp: true, // always used UDP unless we can't
      preferUdp: true,
      listenInfos: [
        {
          protocol: 'udp',
          ip: '127.0.0.1'  // "192.168.0.111"
        },
        {
          protocol: 'tcp',
          ip: '127.0.0.1'  // "192.168.0.111"
        }
      ]
    });

    console.log(thisClientProducerTransport)

    // we could distructer from the thisClientProducerTransport
    // but we store them into the varibale
    const clientTrasportParams = {
      id: thisClientProducerTransport.id,
      iceParameters: thisClientProducerTransport.iceParameters,
      iceCandidates: thisClientProducerTransport.iceCandidates,
      dtlsParameters: thisClientProducerTransport.dtlsParameters
    };

    ack(clientTrasportParams); // what we send back to the client
  });

});


httpServer.listen(config.port, () => {
  console.log(`listening on *:${config.port}`);
})