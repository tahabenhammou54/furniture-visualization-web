import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomStyle, ROOM_STYLES, OUTDOOR_STYLES } from '../../models/build-room.model';

const OUTDOOR_FEATURES = new Set(['exterior', 'garden']);

@Component({
  selector: 'app-style-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './style-selector.component.html',
  styleUrls: ['./style-selector.component.scss'],
})
export class StyleSelectorComponent implements OnChanges {
  @Input() selectedStyleId: string | null = null;
  @Input() feature: string | null = 'interior';
  @Input() styles: RoomStyle[] | null = null;
  @Output() styleSelected = new EventEmitter<RoomStyle>();

  resolvedStyles: RoomStyle[] = ROOM_STYLES;

  ngOnChanges(): void {
    if (this.styles) {
      this.resolvedStyles = this.styles;
    } else {
      this.resolvedStyles = OUTDOOR_FEATURES.has(this.feature ?? '')
        ? OUTDOOR_STYLES
        : ROOM_STYLES;
    }
  }

  select(style: RoomStyle): void {
    this.styleSelected.emit(style);
  }
}
