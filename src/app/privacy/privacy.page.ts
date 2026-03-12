import { Component } from '@angular/core';
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

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [IonContent, IonIcon],
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage {
  readonly usageItems = [
    { text: 'Provide and improve AI furniture visualization features' },
    { text: 'Process your uploaded images and return design results' },
    { text: 'Manage your account and subscription' },
    { text: 'Send generation-complete notifications (if enabled)' },
    { text: 'Respond to support requests and bug reports' },
    { text: 'Ensure app security and prevent abuse' },
  ];

  readonly rights = [
    {
      icon: 'eye-off-outline',
      title: 'Access & Portability',
      desc: 'Request a copy of the data we hold about you.',
    },
    {
      icon: 'create-outline',
      title: 'Correction',
      desc: 'Ask us to correct inaccurate personal information.',
    },
    {
      icon: 'trash-outline',
      title: 'Deletion',
      desc: 'Request deletion of your account and associated data at any time.',
    },
    {
      icon: 'download-outline',
      title: 'Opt-Out',
      desc: 'Disable push notifications or withdraw consent for optional data uses.',
    },
  ];

  constructor(private location: Location) {
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
