import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { TareaAgenda } from '../../../models/tarea-agenda.model';
import { MAPBOX_TOKEN, MapboxToken } from './../../../app.module';
import * as Mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-usuario-perfil',
  templateUrl: './usuario-perfil.component.html',
  styleUrls: ['./usuario-perfil.component.css'],
})
export class UsuarioPerfilComponent implements OnInit {
	map: Mapboxgl.Map;
	coord: [number, number];

  constructor(@Inject(forwardRef(() => MAPBOX_TOKEN)) private token: MapboxToken) {
  	this.coord = [-58.44, -34.59];
  }

  ngOnInit(): void {
  	this.map = new Mapboxgl.Map({
  		accessToken: this.token.accessToken,
  		container: 'map',
  		style: 'mapbox://styles/mapbox/streets-v11',
  		center: this.coord,
  		zoom: 2
  	});
		var popup = new Mapboxgl.Popup({offset: 25})
			.setHTML("<h5>Zona horaria:<br>Buenos Aires, Argentina</h5>");
		let marker = document.createElement('div');
		marker.id = 'marker';
		new Mapboxgl.Marker(marker)
			.setLngLat(this.coord)
			.setPopup(popup)
			.addTo(this.map);
	}

}
