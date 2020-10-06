import {
	reducerTareasAgenda,
	TareasAgendaState,
	initializeTareasAgendaState,
	InitMyDataAction,
	NuevaTareaAction,
	EliminarTareaAction,
	ElegidoPrioridadAction,
	VoteUpAction,
	VoteDownAction
} from './tareas-agenda-state.model';
import { TareaAgenda } from './tarea-agenda.model';

describe('reducerTareasAgenda', () => {
	it('should reduce init data', () => {
		// setup
		const prevState: TareasAgendaState = initializeTareasAgendaState();
		const tarea1: TareaAgenda = new TareaAgenda('tarea 1', '2020-03-24', '');
		const tarea2: TareaAgenda = new TareaAgenda('tarea 2', '2020-03-24', '');
		const action: InitMyDataAction = new InitMyDataAction([tarea1, tarea2]);
		// action
		const newState: TareasAgendaState = reducerTareasAgenda(prevState, action);
		// assert
		expect(newState.items.length).toEqual(2);
		expect(newState.items[1].titulo).toEqual('tarea 2');
	});
	it('should reduce new item', () => {
		// setup
		const prevState: TareasAgendaState = initializeTareasAgendaState();
		const tarea: TareaAgenda = new TareaAgenda('tarea 1', '2020-03-24', '');
		const action: NuevaTareaAction = new NuevaTareaAction(tarea);
		// action
		const newState: TareasAgendaState = reducerTareasAgenda(prevState, action);
		// assert
		expect(newState.items.length).toEqual(1);
		expect(newState.items[0].titulo).toEqual('tarea 1');
	});
	it('should reduce set prioridad', () => {
		// setup
		const prevState: TareasAgendaState = initializeTareasAgendaState();
		const tarea1: TareaAgenda = new TareaAgenda('tarea 1', '2020-03-24', '');
		const tarea2: TareaAgenda = new TareaAgenda('tarea 2', '2020-03-24', '');
		const action1: InitMyDataAction = new InitMyDataAction([tarea1, tarea2]);
		const secondState: TareasAgendaState = reducerTareasAgenda(prevState, action1);
		const action2: ElegidoPrioridadAction = new ElegidoPrioridadAction(tarea1);
		// action
		const thirdState: TareasAgendaState = reducerTareasAgenda(secondState, action2);
		// assert
		expect(thirdState.items.length).toEqual(2);
		expect(thirdState.prioridad).toEqual(tarea1);
	});
	it('should reduce delete item', () => {
		// setup
		const prevState: TareasAgendaState = initializeTareasAgendaState();
		const tarea: TareaAgenda = new TareaAgenda('tarea 1', '2020-03-24', '');
		const action1: NuevaTareaAction = new NuevaTareaAction(tarea);
		const secondState: TareasAgendaState = reducerTareasAgenda(prevState, action1);
		const action2: EliminarTareaAction = new EliminarTareaAction(tarea);
		// action
		const thirdState: TareasAgendaState = reducerTareasAgenda(secondState, action2);
		// assert
		expect(thirdState.items.length).toEqual(0);
		expect(thirdState.items[0]).toEqual(undefined);
		expect(thirdState.prioridad).toEqual(null);
	});
	it('should reduce vote up', () => {
		// setup
		const prevState: TareasAgendaState = initializeTareasAgendaState();
		const tarea: TareaAgenda = new TareaAgenda('tarea', '2020-03-24', '');
		const action1: NuevaTareaAction = new NuevaTareaAction(tarea);
		const secondState: TareasAgendaState = reducerTareasAgenda(prevState, action1);
		const action2: VoteUpAction = new VoteUpAction(tarea);
		// action
		const thirdState: TareasAgendaState = reducerTareasAgenda(secondState, action2);
		const fourthState: TareasAgendaState = reducerTareasAgenda(thirdState, action2);
		// assert
		expect(fourthState.items.length).toEqual(1);
		expect(fourthState.items[0].votes).toEqual(2);
	});
	it('should reduce vote down', () => {
		// setup
		const prevState: TareasAgendaState = initializeTareasAgendaState();
		const tarea: TareaAgenda = new TareaAgenda('tarea', '2020-03-24', '');
		const action1: NuevaTareaAction = new NuevaTareaAction(tarea);
		const secondState: TareasAgendaState = reducerTareasAgenda(prevState, action1);
		const action2: VoteDownAction = new VoteDownAction(tarea);
		// action
		const thirdState: TareasAgendaState = reducerTareasAgenda(secondState, action2);
		const fourthState: TareasAgendaState = reducerTareasAgenda(thirdState, action2);
		// assert
		expect(fourthState.items.length).toEqual(1);
		expect(fourthState.items[0].votes).toEqual(-2);
	});
})