package com.wsproj.chat.chat;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    //add a user (like a user joined this chat!)
    @MessageMapping("/chat.addUser")
    @SendTo("/topics/general")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor){
        //the headeraccessors allows us to establish a connection
        //between user and the websocket.

        //add username in ws session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());

        return chatMessage;

    }

    //send a message
    @MessageMapping("/chat.sendMessage") //listens to methods sent to /app/chat
    @SendTo("/topics/general") //broadcasts return value to /topics/general
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage){
        return chatMessage;
    }
}
