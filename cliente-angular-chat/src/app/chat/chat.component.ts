/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
**@Autor: Jesús Saiz Sedano
**@Título: ChatApp: Angular 8 && Java SpringBoot
**@Version: 1.0 
@ChatComponent.ts
*/

import { Component, OnInit } from '@angular/core';
import {Client} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from './models/mensaje';

import {URL_BACKEND} from '../config/config'



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  private client : Client;
  conectado: boolean = false;

  //modelo Mensaje
  mensaje : Mensaje = new Mensaje();
  mensajes : Mensaje[] = [];
  escribiendo : string;
 


  constructor(){ }

  ngOnInit() {
    this.client = new Client();
    this.client.webSocketFactory = ()=>{
      return new SockJS(URL_BACKEND + '/chat-websocket');
    }

//Funciones para suscribirse al evento y desinscribirse

  //Cliente/stomp cuando se conecta 
  this.client.onConnect = (frame) => {
    console.log('Conectados: ' + this.client.connected + ' : ' + frame);
    this.conectado = true;

    //se suscribe a MENSAJE
    this.client.subscribe('/chat/mensaje', e => {
      let mensaje: Mensaje = JSON.parse(e.body) as Mensaje;
      mensaje.fecha = new Date(mensaje.fecha);

      if (!this.mensaje.color && mensaje.tipo == 'NUEVO_USUARIO'&&
          this.mensaje.username == mensaje.username) {
          this.mensaje.color = mensaje.color;
        } 
       
      this.mensajes.push(mensaje);
      console.log(mensaje);
        
      });


      //se suscribe a escribiendo
      this.client.subscribe('/chat/escribiendo', e => {
          this.escribiendo = e.body;
          setTimeout(() => this.escribiendo = '', 3000)
      });


      this.mensaje.tipo = 'NUEVO_USUARIO';
      this.client.publish({ destination: '/app/mensaje', body: JSON.stringify(this.mensaje) });
    }

    
  //Cliente/stomp cuando se desconecta  
    this.client.onDisconnect = (frame) => {
      console.log('Desconectados: ' + !this.client.connected + ' : ' + frame);
      this.conectado = false;
      this.mensaje = new Mensaje();
      this.mensajes = [];
    }
          
  }
  

  //Funciones para conectarse y desconectarse y enviar recibir

  conectar(): void {
    this.client.activate();
  }

  desconectar(): void {
    this.mensaje.tipo = 'USUARIO_ABANDONAR';
    this.client.publish({ destination: '/app/mensaje', body: JSON.stringify(this.mensaje) });
    this.client.deactivate();
   
  }

  enviarMensaje(): void {
    this.mensaje.tipo = 'MENSAJE';
    this.client.publish({ destination: '/app/mensaje', body: JSON.stringify(this.mensaje) });
    this.mensaje.texto = '';
  }

  escribiendoEvento(): void {
    this.client.publish({ destination: '/app/escribiendo', body: this.mensaje.username });
  }


}/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

