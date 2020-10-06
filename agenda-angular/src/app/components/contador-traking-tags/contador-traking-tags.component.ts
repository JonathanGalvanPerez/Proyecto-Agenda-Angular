import { Component, OnInit } from '@angular/core';
import { TareasApiClient } from './../../models/tareas-api-client.model';

@Component({
  selector: 'app-contador-traking-tags',
  templateUrl: './contador-traking-tags.component.html',
  styleUrls: ['./contador-traking-tags.component.css']
})
export class ContadorTrakingTagsComponent implements OnInit {
	trakingVotesUp: number;
	trakingVotesDown: number;
	trakingDarPrioridad: number;

  constructor(private tareasApiClient: TareasApiClient) {
  	this.tareasApiClient.subscribeOnChangeTrakingTags(
  		trakingVotesUp => { this.trakingVotesUp = trakingVotesUp },
  		trakingVotesDown => { this.trakingVotesDown = trakingVotesDown },
  		trakingDarPrioridad => { this.trakingDarPrioridad = trakingDarPrioridad }
  	);
  }

  ngOnInit(): void {
  }

}
