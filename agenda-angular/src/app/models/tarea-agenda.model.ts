import * as uuid from 'uuid';
export class TareaAgenda {

	constructor(public titulo: string, public fecha: string, public detalles: string, public votes:number = 0, 
	private	prioridad: boolean = false, public id = uuid.v4()) {
	}

	esPrioridad(): boolean {
		return this.prioridad;
	}

	setPrioridad(x: boolean) {
		this.prioridad = x;
	}

	voteUp() {
		this.votes++;
	}
	voteDown() {
		this.votes--;
	}
}