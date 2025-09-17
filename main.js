const aedes = require('aedes')()
const net = require('net')
const http = require('http')
const ws = require('ws')

// --- TCP broker (port 1883) ---
const tcpPort = 1883
const tcpServer = net.createServer(aedes.handle)
tcpServer.listen(tcpPort, '0.0.0.0', () => {
  console.log('🚀 Aedes TCP broker listening on port', tcpPort)
})

// --- WebSocket broker (port 8888) ---
const wsPort = 8883
const httpServer = http.createServer()
const wss = new ws.Server({ server: httpServer })

wss.on('connection', (conn) => {
  const stream = ws.createWebSocketStream(conn)
  aedes.handle(stream)
})

httpServer.listen(wsPort, '0.0.0.0', () => {
  console.log('🌐 Aedes WS broker listening on ws://0.0.0.0:' + wsPort)
})

// --- Event logging ---
aedes.on('client', (client) => {
  console.log('Client connected:', client?.id)
})

aedes.on('clientDisconnect', (client) => {
  console.log('Client disconnected:', client?.id)
})

aedes.on('publish', (packet, client) => {
  if (client) {
    console.log(`Message from ${client.id}:`, packet.topic, packet.payload.toString())
  }
})

// --- Just for development. ---
