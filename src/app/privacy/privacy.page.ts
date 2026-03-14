import { Component, computed } from '@angular/core';
import { Location } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  shieldCheckmarkOutline,
  personOutline,
  imageOutline,
  barChartOutline,
  phonePortraitOutline,
  cloudOutline,
  cardOutline,
  mailOutline,
  createOutline,
  trashOutline,
  downloadOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [IonContent, IonIcon],
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage {
  readonly usageItems = computed(() => [
    { text: this.i18n.t('privacy.usage_item_1') },
    { text: this.i18n.t('privacy.usage_item_2') },
    { text: this.i18n.t('privacy.usage_item_3') },
    { text: this.i18n.t('privacy.usage_item_4') },
    { text: this.i18n.t('privacy.usage_item_5') },
    { text: this.i18n.t('privacy.usage_item_6') },
  ]);

  readonly rights = computed(() => [
    {
      icon: 'eye-off-outline',
      title: this.i18n.t('privacy.right_access_title'),
      desc: this.i18n.t('privacy.right_access_desc'),
    },
    {
      icon: 'create-outline',
      title: this.i18n.t('privacy.right_correction_title'),
      desc: this.i18n.t('privacy.right_correction_desc'),
    },
    {
      icon: 'trash-outline',
      title: this.i18n.t('privacy.right_deletion_title'),
      desc: this.i18n.t('privacy.right_deletion_desc'),
    },
    {
      icon: 'download-outline',
      title: this.i18n.t('privacy.right_opt_out_title'),
      desc: this.i18n.t('privacy.right_opt_out_desc'),
    },
  ]);

  constructor(public i18n: I18nService, private location: Location) {
    addIcons({
      chevronBackOutline,
      shieldCheckmarkOutline,
      personOutline,
      imageOutline,
      barChartOutline,
      phonePortraitOutline,
      cloudOutline,
      cardOutline,
      mailOutline,
      createOutline,
      trashOutline,
      downloadOutline,
      eyeOffOutline,
    });
  }

  goBack(): void {
    this.location.back();
  }
}
