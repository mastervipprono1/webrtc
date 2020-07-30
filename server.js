require("dotenv").config();
const express = require('express')
const app = express();
var https = require('https');
const fs = require("fs");
const path = require("path");
const { v4: uuidV4 } = require('uuid')
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname,"/public")))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})
const options= {
  key: fs.readFileSync(path.join(__dirname,"/mydomain.key")),
  cert: fs.readFileSync(path.join(__dirname,"/mydomain.crt")),
}
const server = https.createServer(options,app);
const io = require('socket.io')(server)
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    console.log(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT ||8000,()=>{
  console.log("Thanh Cong");
})