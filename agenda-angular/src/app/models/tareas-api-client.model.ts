import { TareaAgenda } from './tarea-agenda.model';
import { Store } from '@ngrx/store';
import { AppState, db } from '../app.module';
import { ElegidoPrioridadAction, NuevaTareaAction, EliminarTareaAction, VoteUpAction, VoteDownAction } from './tareas-agenda-state.model';
import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from './../app.module'

//import { Subject, BehaviorSubject } from 'rxjs'

@Injectable()
export class TareasApiClient {
	tareas: TareaAgenda[];
	constructor(private store: Store<AppState>,
		@Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig,
		private http: HttpClient) {
		this.store.select(state => state.tareas.items).subscribe(items => this.tareas = items);
	}
	add(tarea: TareaAgenda) {
		const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
		const req = new HttpRequest('POST', this.config.apiEndpoint + '/my', tarea, { headers: headers });
		this.http.request(req).subscribe((data: HttpResponse<{}>) => {
			if(data.status === 200) {
				this.store.dispatch(new NuevaTareaAction(tarea));
				const myDb = db;
				myDb.tareas.add(tarea);
				console.log('Todas las tareas de la db');
				myDb.tareas.toArray().then(tareas => console.log(tareas));
			}
		});
	}
	delete(tarea: TareaAgenda) {
		const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    	const req = new HttpRequest('GET', this.config.apiEndpoint + '/delete?id=' + tarea.id, { headers: headers });
    	this.http.request(req).subscribe((data: HttpResponse<{}>) => {
    		if (data.status === 200)
				this.store.dispatch(new EliminarTareaAction(tarea));	
    	});
	}
	getAll(): TareaAgenda[] {
		return this.tareas;
	}
	// priorizar es equivalente a la funcion "elegir" que hace el profe
	priorizar(tarea: TareaAgenda) {
		const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    	const req = new HttpRequest('GET', this.config.apiEndpoint + '/prior?id=' + tarea.id, { headers: headers });
    	this.http.request(req).subscribe((data: HttpResponse<{}>) => {
    		if (data.status === 200)
				this.store.dispatch(new ElegidoPrioridadAction(tarea));
    	});
	}
	voteUp(tarea: TareaAgenda) {
		const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    	const req = new HttpRequest('GET', this.config.apiEndpoint + '/vote?id=' + tarea.id + '&v=1', { headers: headers });
    	this.http.request(req).subscribe((data: HttpResponse<{}>) => {
    		if (data.status === 200)
				this.store.dispatch(new VoteUpAction(tarea));
    	});
	}
	voteDown(tarea: TareaAgenda) {
		const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    	const req = new HttpRequest('GET', this.config.apiEndpoint + '/vote?id=' + tarea.id + '&v=-1', { headers: headers });
    	this.http.request(req).subscribe((data: HttpResponse<{}>) => {
    		if (data.status === 200)
				this.store.dispatch(new VoteDownAction(tarea));
    	});
	}
	subscribeOnChangePrioridad(fn) {
		this.store.select(state => state.tareas.prioridad).subscribe(fn);
	}
	subscribeOnChangeTrakingTags(fn1, fn2, fn3) {
		this.store.select(state => state.tareas.trakingTags.trakingVotesUp).subscribe(fn1);
		this.store.select(state => state.tareas.trakingTags.trakingVotesDown).subscribe(fn2);
		this.store.select(state => state.tareas.trakingTags.trakingDarPrioridad).subscribe(fn3);
	}
}