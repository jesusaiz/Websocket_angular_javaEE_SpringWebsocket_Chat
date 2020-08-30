package com.backend.spring.chat;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {

		// ruta para conectarnos al websocket cliente
		registry.addEndpoint("/chat-websocket").setAllowedOrigins("http://localhost:4200", "*").withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {

		// configuramos el broker con la ruta de suscripción y la de destino
		registry.enableSimpleBroker("/chat/");
		registry.setApplicationDestinationPrefixes("/app");

	}

}
