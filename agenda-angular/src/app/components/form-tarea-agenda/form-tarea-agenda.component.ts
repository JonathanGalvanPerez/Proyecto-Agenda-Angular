import { Component, OnInit, Output, EventEmitter, Inject, forwardRef } from '@angular/core';
import { TareaAgenda } from '../../models/tarea-agenda.model';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { fromEvent, combineLatest, Observable } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { APP_CONFIG, AppConfig } from 'src/app/app.module';

@Component({
  selector: 'app-form-tarea-agenda',
  templateUrl: './form-tarea-agenda.component.html',
  styleUrls: ['./form-tarea-agenda.component.css']
})
export class FormTareaAgendaComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<TareaAgenda>;
  fg: FormGroup;
  searchResults: string[];
  minLongitud = 5;

  constructor(fb: FormBuilder, @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig) {
  	this.onItemAdded = new EventEmitter();
  	this.fg = fb.group({
  		titulo: ['', Validators.compose([
  			Validators.required,
  			this.validatorParametrizable(this.minLongitud)
  		])],
  		fecha: ['', Validators.required],
  		detalles: ['']
  	})

  	this.fg.valueChanges.subscribe((form: any) => {
  		console.log("cambio el formulario: ", form);
  	})
  }

  ngOnInit(): void {
    let elemTitulo = <HTMLInputElement>document.getElementById('titulo');
    // Observable de los eventos de teclado del campo titulo
    const entrada = fromEvent(elemTitulo, 'input')
      .pipe(
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        filter(text => text.length > 3),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((text: string) => ajax(this.config.apiEndpoint + '/eventos?q=' + text))
      ).subscribe(ajaxResponse => this.searchResults = ajaxResponse.response);
  }

  guardar(titulo: string, fecha: string, detalles: string): boolean {
  	const tarea = new TareaAgenda(titulo, fecha, detalles);
  	this.onItemAdded.emit(tarea);
  	return false;
  }

  tituloValidator(control: FormControl): { [s: string]: boolean } {
  	let l = control.value.toString().trim().lenght;
  	if (l > 0 && l < 5) {
  		return { invalidTitulo: true }
  	}
  	return null;
  }

  validatorParametrizable(minLong: number): ValidatorFn {
  	return (control: FormControl): { [s: string]: boolean } | null => {
  		const l = control.value.toString().trim().length;
  		if (l > 0 && l < minLong) {
  			return { minLongTitulo: true };
  		}
  		return null;
  	}
  }

}
