package com.backend.spring.chat.controllers;

import java.util.Date;
import java.util.Random;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;


import com.backend.spring.chat.models.entity.Mensaje;

@Controller
public class ChatController {
	
	private String[] colores = {"#2196F3", "#32c787", "#00BCD4", "#ff5652",
			"#ffc107", "#ff85af", "#FF9800", "#39bbb0"};

	// donde los usuarios van a enviar y recibir los mensajes del chat
	@MessageMapping("/mensaje") //==> publicar
	@SendTo("/chat/mensaje") 	//==> recibir suscribirse
	public Mensaje recibeMensaje(Mensaje mensaje) {	
		mensaje.setFecha(new Date().getTime());
		
		if(mensaje.getTipo().equals("NUEVO_USUARIO")) {
			mensaje.setColor(colores[new Random().nextInt(colores.length)]);
			mensaje.setTexto("Nuevo usuario");
		}
		else if (mensaje.getTipo().equals("USUARIO_ABANDONAR")) {
			mensaje.setTexto("...abandonó el chat");
		}
		return mensaje;
	}
	
	//Cuando escribe el Usuario
	@MessageMapping("/escribiendo") 
	@SendTo("/chat/escribiendo")
	public String escribiendoMenj(String username) {
		return username.concat("  esta escribiendo...");
	}
	
	
}
