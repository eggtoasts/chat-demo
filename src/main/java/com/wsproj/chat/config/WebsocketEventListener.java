package com.wsproj.chat.config;

import com.wsproj.chat.chat.ChatMessage;
import com.wsproj.chat.chat.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebsocketEventListener {

    //Our dependency injection
    private final SimpMessageSendingOperations messageTemplate;

    @EventListener
    //if we want it to listen to a different event
    public void handleWebSocketDisconnect(SessionDisconnectEvent event) {

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if(username != null){
            log.info("User disconnected: {}", username);
            var chatMessage = ChatMessage.builder().type(MessageType.LEAVE).sender(username).build();
            messageTemplate.convertAndSend("/topics/general", chatMessage);
        }

    }

}
