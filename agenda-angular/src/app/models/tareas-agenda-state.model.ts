import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TareaAgenda } from './tarea-agenda.model';

//Estado
export interface TareasAgendaState {
  items: TareaAgenda[];
  loading: boolean;
  prioridad: TareaAgenda;
  trakingTags: {
    trakingVotesUp: number;
    trakingVotesDown: number;
    trakingDarPrioridad: number;
  }
}

export function initializeTareasAgendaState() {
  return {
  	items: [],
  	loading: false,
  	prioridad: null,
    trakingTags: {
      trakingVotesUp: 0,
      trakingVotesDown: 0,
      trakingDarPrioridad: 0
    }
  };
};

// Acciones
export enum TareasAgendaActionTypes {
  NUEVA_TAREA = '[Tareas Agenda] Nuevo',
  ELIMINAR_TAREA = '[Tareas Agenda] Eliminar',
  ELEGIDO_PRIORIDAD = '[Tareas Agenda] Prioridad',
  VOTE_UP = '[Tareas Agenda] Vote up',
  VOTE_DOWN = '[Tareas Agenda] Vote Down',
  INIT_MY_DATA = '[Tareas Agenda] Init My Data'
}

export class NuevaTareaAction implements Action {
  type = TareasAgendaActionTypes.NUEVA_TAREA;
  constructor(public tarea: TareaAgenda) {}
}

export class EliminarTareaAction implements Action {
  type = TareasAgendaActionTypes.ELIMINAR_TAREA;
  constructor(public tarea: TareaAgenda) {}
}

export class ElegidoPrioridadAction implements Action {
  type = TareasAgendaActionTypes.ELEGIDO_PRIORIDAD;
  constructor(public tarea: TareaAgenda) {}
}

export class VoteUpAction implements Action {
  type = TareasAgendaActionTypes.VOTE_UP;
  constructor(public tarea: TareaAgenda) {}
}

export class VoteDownAction implements Action {
  type = TareasAgendaActionTypes.VOTE_DOWN;
  constructor(public tarea: TareaAgenda) {}
}

export class InitMyDataAction implements Action {
  type = TareasAgendaActionTypes.INIT_MY_DATA;
  constructor(public tareas: TareaAgenda[]) {}
}

export type TareasAgendaActions = NuevaTareaAction | ElegidoPrioridadAction | EliminarTareaAction
	| VoteUpAction | VoteDownAction | InitMyDataAction;

// Reducers
export function reducerTareasAgenda (
  state: TareasAgendaState,
  action: TareasAgendaActions
): TareasAgendaState {
  switch (action.type) {
    case TareasAgendaActionTypes.INIT_MY_DATA: {
      const tareas: TareaAgenda[] = (action as InitMyDataAction).tareas;
      return {
        ...state,
        items: tareas
      };
    }
  	case TareasAgendaActionTypes.NUEVA_TAREA: {
  		return {
  			...state,
  			items: [...state.items, (action as NuevaTareaAction).tarea]
  		};
  	}
  	case TareasAgendaActionTypes.ELIMINAR_TAREA: {
  		var eliminado = (action as EliminarTareaAction).tarea;
			const tareas = state.items.filter(t => t != eliminado);
			var prior = state.prioridad;
			if (eliminado == prior)
				prior = null;
  		return {
  			...state,
  			items: tareas,
  			prioridad: prior
  		};
  	}
		case TareasAgendaActionTypes.ELEGIDO_PRIORIDAD: {
			const prior: TareaAgenda = (action as ElegidoPrioridadAction).tarea;
			// Mueve la tarea al inicio para destacarla
			var tareas;
			if (state.items.length > 1) {
				tareas = state.items.filter(t => t != prior);
				tareas.unshift(prior);
			}	else {
				tareas = state.items;
			}
			// Quito la prioridad a todos y se la doy a la elegida
			tareas.forEach(x => x.setPrioridad(false));
			prior.setPrioridad(true);
      state.trakingTags.trakingDarPrioridad++;
			return {
				...state,
				items: tareas,
				prioridad: prior
			};
		}
  	case TareasAgendaActionTypes.VOTE_UP: {
  		const votado = (action as VoteUpAction).tarea;
			votado.voteUp();
      state.trakingTags.trakingVotesUp++;
  		return {
  			...state
  		};
  	}
  	case TareasAgendaActionTypes.VOTE_DOWN: {
  		const votado = (action as VoteDownAction).tarea;
  		votado.voteDown();
      state.trakingTags.trakingVotesDown++;
  		return {
  			...state,
  		};
  	}
	}
	return state;
}

// Effects
@Injectable()
export class TareasAgendaEffects {
	@Effect()
	nuevoAgregado$: Observable<Action> = this.action$.pipe(
		ofType(TareasAgendaActionTypes.NUEVA_TAREA),
		map((action: NuevaTareaAction) => new ElegidoPrioridadAction(action.tarea))
	);

	constructor(private action$: Actions) {}
}