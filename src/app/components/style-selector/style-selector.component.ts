import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomStyle, ROOM_STYLES } from '../../models/build-room.model';

@Component({
  selector: 'app-style-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './style-selector.component.html',
  styleUrls: ['./style-selector.component.scss'],
})
export class StyleSelectorComponent {
  @Input() selectedStyleId: string | null = null;
  @Input() styles: RoomStyle[] = ROOM_STYLES;
  @Output() styleSelected = new EventEmitter<RoomStyle>();

  select(style: RoomStyle): void {
    this.styleSelected.emit(style);
  }
}
