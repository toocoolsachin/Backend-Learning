import http from 'node:http'
import { WebSocketServer } from 'ws'
import fs from 'node:fs/promises'
import path from 'path'
import { redisPublish, redisSubscribe } from './connection.js'

const PORT = process.env.PORT ?? 9000
const REDIS_CHANNEL = 'chat'

redisSubscribe.subscribe(REDIS_CHANNEL, (err, count) => {
  if (err) {
    console.error('Failed to subscribe: %s', err.message)
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`,
    )
  }
})
redisSubscribe.on('message', (channel, message) => {
  console.log(`Received message from channel ${channel}: ${message}`)
  // Broadcast the message to all connected WebSocket clients
  wsServer.clients.forEach((client) => {
    if (channel === REDIS_CHANNEL && client.readyState === 1) {
      client.send(message.toString())
    }
  })
})

const httpServer = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  const indexPath = path.resolve('./index.html')
  const indexContent = await fs.readFile(indexPath, 'utf8')
  res.end(indexContent)
})
const wsServer = new WebSocketServer({ server: httpServer })

wsServer.on('connection', (socket) => {
  console.log('New client connected')

  socket.on('message', (message) => {
    console.log(`Received message: ${message.toString()}`)

    // Relay the messgage to the broker
    console.log('Relaying message to redis broker...')
    redisPublish.publish(REDIS_CHANNEL, message.toString())
  })
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
