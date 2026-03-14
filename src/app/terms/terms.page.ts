import { Component, computed } from '@angular/core';
import { Location } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  documentTextOutline,
  personOutline,
  cardOutline,
  imageOutline,
  shieldCheckmarkOutline,
  alertCircleOutline,
  refreshOutline,
  mailOutline,
  banOutline,
} from 'ionicons/icons';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [IonContent, IonIcon],
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage {
  readonly prohibitedItems = computed(() => [
    this.i18n.t('terms.prohibited_1'),
    this.i18n.t('terms.prohibited_2'),
    this.i18n.t('terms.prohibited_3'),
    this.i18n.t('terms.prohibited_4'),
    this.i18n.t('terms.prohibited_5'),
    this.i18n.t('terms.prohibited_6'),
  ]);

  constructor(public i18n: I18nService, private location: Location) {
    addIcons({
      chevronBackOutline,
      documentTextOutline,
      personOutline,
      cardOutline,
      imageOutline,
      shieldCheckmarkOutline,
      alertCircleOutline,
      refreshOutline,
      mailOutline,
      banOutline,
    });
  }

  goBack(): void {
    this.location.back();
  }
}
