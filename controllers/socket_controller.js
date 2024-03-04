const mongoose = require("mongoose");
const Chat = require("../models/chat");
const moment = require("moment");
const fs = require('fs');
const path = require("path");
const messages = [];

exports.handleSocket = async (socketIO, req, res) => {
    socketIO.on("connection",  (socket) => {
        const person1Name = socket.handshake.query.username;
        let person1Id = socket.handshake.query.userId;
        console.log("Connected to ", person1Name , socket.id);
        //listens for new messages coming in
        socket.on("message", async (data) => {
            const person2Id = mongoose.Types.ObjectId(data.targetId);
            let person2Name = data.targetId || '';
            const sentAt = moment(data.sentAt).format("MMM DD, YYYY hh:mm");
            
            const message = {
                senderId: person1Id,
                message: data.message,
                image: data.image,
                sentAt: sentAt
            }
            person1Id = mongoose.Types.ObjectId(person1Id);
            // console.log(person1Id)
            const filter = {
                $or: [
                    {$and: [{ person1Id: person1Id }, { person2Id: person2Id }]},
                    {$and: [{ person1Id: person2Id }, { person2Id: person1Id }]}
                ]
            };
            const update = {
                $push: {message: message}
            };
            const opt = {
                new : true
            }
            try {
                const chat = await Chat.findOne(filter); 
                if (chat){
                    const updatedChat = await Chat.findOneAndUpdate({_id: chat._id}, update, opt);
                    if (updatedChat) {
                        console.log(updatedChat)
                        socketIO.emit("message", updatedChat);
                    } else {
                        console.log("chat isnt update");
                    }
                } else {
                    message.senderId = person1Id;
                    const newChat = new Chat({
                        person1Id: person1Id,
                        message: [message],
                        person1Name: person1Name,
                        person2Id: person2Id,
                        person2Name: person2Name,
                    })
                    const savedChat = await newChat.save();
                    if(savedChat) {
                        socketIO.emit("message", newChat)
                    } else{
                        console.log('sth went wrong');
                    }
                }
            } catch (err) {
                console.log(err)
            }
        });
        

        //listens when a user is disconnected from the server
        socket.on("disconnect", function () {
            console.log("Disconnected...", socket.id);
        });

        //listens when there's an error detected and logs the error on the console
        socket.on("error", function (err) {
            console.log("Error detected", socket.id);
            console.log(err);
        });
    });
}