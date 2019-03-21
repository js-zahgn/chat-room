const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').Server(app);

const IO = require('socket.io')(http);

const fileName = path.resolve(__dirname,'./data.json');
const ChatHistory = JSON.parse(fs.readFileSync(fileName, 'utf-8', () => { }));

IO.on('connection', (socket) => {
  
  socket.on('disconnect', () => console.log('断开链接'));

  // 向客户端发送聊天记录
  IO.emit('message', ChatHistory.history);

  socket.on('chat message', ({ sender, msg }) => {
    const param = {
      sender, msg,
      avatar: '',
      time: new Date().getTime()
    };
    const { history } = ChatHistory;
    history.push(param);
    const newJson = JSON.stringify(ChatHistory);
    fs.writeFile(fileName, newJson, () => { });
    IO.emit('new message', param);
  });
});

const port = 3001;
http.listen(port, () => console.log(`Server is running at ${port}`));
