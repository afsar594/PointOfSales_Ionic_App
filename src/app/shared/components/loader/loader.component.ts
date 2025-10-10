import { Component, OnInit } from '@angular/core';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

  
import { IonItem, IonLabel, IonSpinner } from '@ionic/angular/standalone';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  
  imports: [IonItem, IonLabel, IonSpinner],
})
export class LoaderComponent  implements OnInit {

    constructor( public loadingservice : LoadingServiceService) { }

  ngOnInit() {}
}
