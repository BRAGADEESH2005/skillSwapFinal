const io = require("socket.io")(8800,{
    cors:{
        origin:"http://localhost:3000"
    }
})

let activeUsers=[];

io.on("connection",(socket)=>{

    //Add new User
    //on ---> to take something from the front end
    //emit --->to give something to the frontend
    socket.on("new-user-add",(newUserId)=>{
        //Add users if they are not in active user
        if(!activeUsers.some((user)=> user.userId === newUserId))
        {
            if (newUserId !== null){
                activeUsers.push({
                    userId:newUserId,
                    socketId:socket.id
                })
        }
        }
        console.log("Connected users",activeUsers)
        io.emit("get-users",activeUsers)
    })
    //send mesaage

    socket.on("send-message",(data)=>{
        console.log("user1 ",activeUsers)

        const {receiverId} = data;
        const user = activeUsers.find((user)=> user.userId === receiverId)
        console.log("Sending from socket to:",receiverId)
        console.log(data)
        console.log("user 2",activeUsers)
        console.log("active user ",user)
        if (user){
            console.log("emitting")
            io.to(user.socketId).emit("receive-message",data)
        }
    })

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => {
            return user.socketId !== socket.id; // Added return statement
        });
        console.log("Users Disconnected", activeUsers);
        io.emit("get-users", activeUsers);
    });


    //video chatt

    socket.emit("me", socket.id);

	socket.on("video-disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});

})












// const http = require('http');
// const socketIO = require('socket.io');
// const express = require('express');
// const app = express();

// const server = http.createServer(app);
// const serverIO = socketIO(server);

// const PORT = 8800;

// const serverIO = require("socket.io")(8800,{
//     cors:{
//         origin: "http://localhost:3000"
//     }
// })


// //sockert

// serverIO.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
  
//     // Handle user joining and leaving
//     socket.on('new-user-add', (userId) => {
//       socket.join(userId);
//       const rooms = serverIO.sockets.adapter.rooms.get(userId);
//       const users = [...rooms];
//       serverIO.emit('get-users', users);
//     });
  
//     socket.on('disconnect', () => {
//       console.log('A user disconnected:', socket.id);
//     });
  
//     // Handle sending messages
//     socket.on('send-message', ({ newMessage, receiverId }) => {
//       // Emit the message to the specified receiver room
//       serverIO.to(receiverId).emit('receive-message', {
//         receiverId,
//         message: newMessage,
//       });
//     });
//   });

// server.listen(PORT, () => {
//   console.log(`Socket server is running on port ${PORT}`);
// });
