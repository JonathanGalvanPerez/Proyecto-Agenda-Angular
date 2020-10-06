import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, Injectable, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule as NgRxStoreModule, ActionReducerMap, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule, } from '@ngrx/store-devtools';
import { HttpClientModule, HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import Dexie from 'dexie';


import { AppComponent } from './app.component';
import { ListaTareasComponent } from './components/lista-tareas/lista-tareas.component';
import { TareaAgendaComponent } from './components/tarea-agenda/tarea-agenda.component';
import { PlanTareaComponent } from './components/plan-tarea/plan-tarea.component';
import { FormTareaAgendaComponent } from './components/form-tarea-agenda/form-tarea-agenda.component';
import { TareasApiClient } from './models/tareas-api-client.model';
import { TareaAgenda } from './models/tarea-agenda.model';
import { TareasAgendaState, reducerTareasAgenda, initializeTareasAgendaState, TareasAgendaEffects, InitMyDataAction } from './models/tareas-agenda-state.model';
import { LoginComponent } from './components/login/login/login.component';
import { UsuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado.guard';
import { AuthService } from './services/auth.service';
import { UsuarioComponent } from './components/usuario/usuario/usuario.component';
import { UsuarioPerfilComponent } from './components/usuario/usuario-perfil/usuario-perfil.component';
import { UsuarioAmigosComponent } from './components/usuario/usuario-amigos/usuario-amigos.component';
import { UsuarioNotificacionesComponent } from './components/usuario/usuario-notificaciones/usuario-notificaciones.component';
import { TrackearClickDirective } from './trackear-click.directive';
import { ContadorTrakingTagsComponent } from './components/contador-traking-tags/contador-traking-tags.component';

// app config
export interface AppConfig {
  apiEndpoint: string;
}
const APP_CONFIG_VALUE: AppConfig = {
  apiEndpoint: 'https://agenda-angular.herokuapp.com/'
};
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
// fin app config

// mapbox token
export interface MapboxToken {
  accessToken: string;
}
const MAPBOX_TOKEN_VALUE: MapboxToken = {
  accessToken: 'pk.eyJ1Ijoiam9ueTI0MDMiLCJhIjoiY2tmcW1mM2w4MDVuNTJybzhnbHJoMTUwdSJ9.PBn4X07wXTcCza9iRrUNzg'
};
export const MAPBOX_TOKEN = new InjectionToken<MapboxToken>('mapbox.token');
// fin mapbox token

// routing init
export const childrenRoutesUsuario:Routes = [
  { path: '', redirectTo: 'perfil', pathMatch:'full' },
  { path: 'perfil', component: UsuarioPerfilComponent },
  { path: 'amigos', component: UsuarioAmigosComponent },
  { path: 'notificaciones', component: UsuarioNotificacionesComponent },
  { path: 'logout', component: LoginComponent }
  ];
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: ListaTareasComponent },
  { path: 'plan', component: PlanTareaComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'usuario',
    component: UsuarioComponent,
    canActivate: [ UsuarioLogueadoGuard ],
    children: childrenRoutesUsuario
  }
];
// fin routing init

// redux init
export interface AppState {
  tareas: TareasAgendaState;
}

const reducers: ActionReducerMap<AppState> = {
  tareas: reducerTareasAgenda
};

let reducersInitialState = {
  tareas: initializeTareasAgendaState()
}

// fin redux init

// app init
export function init_app(appLoadService: AppLoadService): () => Promise<any> {
  return () =>appLoadService.initializeTareasState();
}
@Injectable()
class AppLoadService {
  constructor(private store: Store<AppState>, private http: HttpClient) {}
  async initializeTareasState(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndpoint + '/my', { headers: headers });
    const response: any = await this.http.request(req).toPromise();
    var tareas = response.body.map((t) => new TareaAgenda(t.titulo, t.fecha, t.detalles, t.votes, t.prioridad, t.id));
    this.store.dispatch(new InitMyDataAction(tareas));
  }
}
// fin app init

// dexie db
@Injectable({
  providedIn: 'root'
})
export class MyDataBase extends Dexie {
  tareas: Dexie.Table<TareaAgenda, number>;
  constructor() {
    super('MyDataBase');
    this.version(1).stores({
      tareas: '++id, titulo, fecha'
    });
  }
}
export const db = new MyDataBase();
// fin dexie db

@NgModule({
  declarations: [
    AppComponent,
    ListaTareasComponent,
    TareaAgendaComponent,
    PlanTareaComponent,
    FormTareaAgendaComponent,
    LoginComponent,
    UsuarioComponent,
    UsuarioPerfilComponent,
    UsuarioAmigosComponent,
    UsuarioNotificacionesComponent,
    TrackearClickDirective,
    ContadorTrakingTagsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    NgRxStoreModule.forRoot(reducers, {
      initialState: reducersInitialState,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false
      }
    }),
    EffectsModule.forRoot([TareasAgendaEffects]),
    StoreDevtoolsModule.instrument()
  ],
  providers: [
    TareasApiClient,
    UsuarioLogueadoGuard,
    AuthService,
    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },
    { provide: MAPBOX_TOKEN, useValue: MAPBOX_TOKEN_VALUE },
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },
    MyDataBase
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
