import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-merge-table',
  templateUrl: './merge-table.component.html',
  styleUrls: ['./merge-table.component.scss'],
    standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class MergeTableComponent  implements OnInit {

  constructor() { }

   ngOnInit() {
   }
}
