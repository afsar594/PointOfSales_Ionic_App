import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-add-table',
  templateUrl: './add-table.component.html',
  styleUrls: ['./add-table.component.scss'],
   standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AddTableComponent  implements OnInit {
  tables = [
    { id: 5, name: 'Table 5', capacity: 4 },
    { id: 6, name: 'Table 6', capacity: 2 },
    { id: 7, name: 'Table 7', capacity: 4 },
    { id: 8, name: 'Table 8', capacity: 4 },
    { id: 9, name: 'Table 9', capacity: 6 },
    { id: 10, name: 'Table 10', capacity: 2 },
    { id: 11, name: 'Table 11', capacity: 4 },
    { id: 13, name: 'Table 13', capacity: 6 },
    { id: 14, name: 'Table 14', capacity: 2 },
    { id: 15, name: 'Table 15', capacity: 4 },
    { id: 16, name: 'Table 16', capacity: 4 },
    { id: 17, name: 'Table 17', capacity: 2 },
  ];
  constructor() { }

  ngOnInit() {}

}
