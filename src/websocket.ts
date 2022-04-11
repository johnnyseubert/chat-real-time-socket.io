import { io } from "./http";

interface RoomUser {
   socket_id: string,
   username: string,
   room: string
}
interface Message {
   room: string;
   text: string;
   createdAt: Date;
   username: string;
}

const users: RoomUser[] = [];
const messages: Message[] = [];


io.on("connection", (socket) => {

   //QUANDO ENTRAR EM UMA SALA
   socket.on("select_room", (data, callback) => {
      //conecta o usuario a uma sala especifica
      socket.join(data.room);
      //verifica se o usuário já está conectado a sala
      const userInRoom = users.find(user => user.username == data.username && user.room == data.room)
      if (userInRoom) {
         userInRoom.socket_id = socket.id
      } else {
         //adiciona o usuario a lista de usuarios conectados a sala
         users.push({
            socket_id: socket.id,
            username: data.username,
            room: data.room
         })
      }

      const messagesRoom = getMessagesRoom(data.room)
      callback(messagesRoom);

      console.log(users)
   });


   //QUANDO ENVIAR UMA MENSAGEM
   socket.on('message', data => {
      //salvar as mensagens 
      const message: Message = {
         room: data.room,
         username: data.username,
         text: data.message,
         createdAt: new Date()
      }

      messages.push(message);

      //enviar para os usuários da sala
      io.to(data.room).emit('message', message);

   })

})

function getMessagesRoom(room: String) {
   const messagesRoom = messages.filter((message) => message.room === room)
   return messagesRoom;
}