import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TareaAgenda } from '../../models/tarea-agenda.model';
import { TareasApiClient } from '../../models/tareas-api-client.model';

// Dependencies Injection

class ClaseVieja {
  protected mensaje: string;
  constructor() {
    this.mensaje = "Soy una clase vieja, no hago nada!";
  }
  foo() {
    console.log(this.mensaje);
  }
}

export class ClaseNueva {
  protected mensaje: string;
  constructor() {
    this.mensaje = "Soy una clase nueva, no hago nada!";
  }
  foo() {
    console.log(this.mensaje);
  }
}

class ClaseNuevaDecorada extends ClaseNueva {
  constructor(){
    super();
    this.mensaje = "Soy una clase nueva decorada, no hago nada";
  }
}

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.css'],
  providers: [
    { provide: ClaseNueva, useClass: ClaseNuevaDecorada },
    { provide: ClaseVieja, useExisting: ClaseNueva }
  ]
})
export class ListaTareasComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<TareaAgenda>;
  updates: string[];

  constructor(public tareasApiClient: TareasApiClient, private dependencia: ClaseVieja) {
    this.onItemAdded = new EventEmitter();
    this.updates = [];
    this.tareasApiClient.subscribeOnChangePrioridad((tarea: TareaAgenda) => {
      if (tarea != null) {
        this.updates.push('Se ha elegido a ' + tarea.titulo)
      }
    });
  }

  ngOnInit(): void {
    this.dependencia.foo();
  }

  agregado(tarea: TareaAgenda) {
	  this.tareasApiClient.add(tarea);
    this.onItemAdded.emit(tarea);
  }

  priorizar(tarea: TareaAgenda){
    //Selecciona la tarea y la mueve al inicio
    this.tareasApiClient.priorizar(tarea);
  }

  eliminar(tarea: TareaAgenda){
    this.tareasApiClient.delete(tarea);
  }

}
