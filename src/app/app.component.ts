import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from './_services/genesys-cloud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isAuthorized = false;

  constructor(private readonly gcSvc: GenesysCloudService) {}
  
  ngOnInit(): void {
    this.gcSvc.isAuthorized.subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }
}
