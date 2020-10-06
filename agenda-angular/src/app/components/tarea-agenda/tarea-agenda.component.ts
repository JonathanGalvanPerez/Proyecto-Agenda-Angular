import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { TareaAgenda } from '../../models/tarea-agenda.model';
import { TareasApiClient } from '../../models/tareas-api-client.model';
import { AppState } from '../../app.module';
import { Store } from '@ngrx/store';
import { VoteUpAction, VoteDownAction } from '../../models/tareas-agenda-state.model';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';


@Component({
  selector: 'app-tarea-agenda',
  templateUrl: './tarea-agenda.component.html',
  styleUrls: ['./tarea-agenda.component.css'],
  animations: [
    trigger('esPrioridad', [
      state('estadoPrioridad', style({
        backgroundColor: 'PaleTurquoise',
        transform: 'translateX(0)'
      })),
      state('estadoNoPrioridad', style({
        backgroundColor: 'WhiteSmoke'
      })),
      transition('estadoNoPrioridad => estadoPrioridad', [
        style({ transform: 'translateX(-150%)' }),
        animate('1s 0.5s')
      ]),
      transition('estadoPrioridad => estadoNoPrioridad', [
        style({ transform: 'translateY(-100%)' }),
        animate('0.5s')
      ])
    ])
  ]
})
export class TareaAgendaComponent implements OnInit {
  @Input() tarea: TareaAgenda;
  @Input() indice: number;
  //@HostBinding('attr.class') cssClass = 'card';
  @Output() darPrioridad: EventEmitter<TareaAgenda>;
  @Output() eliminar: EventEmitter<TareaAgenda>;

  constructor(private tareasApiClient: TareasApiClient) {
  	this.darPrioridad = new EventEmitter();
    this.eliminar = new EventEmitter();
  }

  ngOnInit(): void {
  }

  seleccionar():boolean {
  	this.darPrioridad.emit(this.tarea);
  	return false;
  }

  borrar():boolean {
    this.eliminar.emit(this.tarea);
    return false;
  }

  voteUp() {
    this.tareasApiClient.voteUp(this.tarea);
    return false;
  }

  voteDown() {
    this.tareasApiClient.voteDown(this.tarea);
    return false;
  }
}
