import { Component, input, computed } from '@angular/core';

const ICONS: Record<string, string> = {
  'home-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline stroke-linecap="round" stroke-linejoin="round" points="9 22 9 12 15 12 15 22"/>`,
  'business-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M9 21V7l6-4v18M9 12h6M9 8h1M14 8h1M9 16h1M14 16h1"/>`,
  'leaf-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M2 22c1.5-1.5 3-6 5.5-8.5C11 10 15.5 9 22 2c-9 0-14 3-16.5 8.5C4 12 3 15.5 2 22z"/>`,
  'swap-horizontal-outline': `<polyline stroke-linecap="round" stroke-linejoin="round" points="16 3 21 8 16 13"/><line stroke-linecap="round" stroke-linejoin="round" x1="21" y1="8" x2="3" y2="8"/><polyline stroke-linecap="round" stroke-linejoin="round" points="8 21 3 16 8 11"/><line stroke-linecap="round" stroke-linejoin="round" x1="3" y1="16" x2="21" y2="16"/>`,
  'color-palette-outline': `<circle stroke-linecap="round" stroke-linejoin="round" cx="13.5" cy="6.5" r=".5"/><circle stroke-linecap="round" stroke-linejoin="round" cx="17.5" cy="10.5" r=".5"/><circle stroke-linecap="round" stroke-linejoin="round" cx="8.5" cy="7.5" r=".5"/><circle stroke-linecap="round" stroke-linejoin="round" cx="6.5" cy="12.5" r=".5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>`,
  'construct-outline': `<line stroke-linecap="round" stroke-linejoin="round" x1="3" y1="21" x2="21" y2="3"/><path stroke-linecap="round" stroke-linejoin="round" d="M12.793 6.793a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414"/><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 16.5 5 19l-2-2 2.5-2.5M7.5 7.5l4-4 1.5 1.5-4 4M16.5 16.5l2.5 2.5 2-2-2.5-2.5"/>`,
  'grid-outline': `<rect stroke-linecap="round" stroke-linejoin="round" x="3" y="3" width="7" height="7"/><rect stroke-linecap="round" stroke-linejoin="round" x="14" y="3" width="7" height="7"/><rect stroke-linecap="round" stroke-linejoin="round" x="3" y="14" width="7" height="7"/><rect stroke-linecap="round" stroke-linejoin="round" x="14" y="14" width="7" height="7"/>`,
  'sparkles-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.02 12.02.707.707M1 12h1m18 0h1M4.22 19.78l.707-.707M18.364 5.636l.707-.707M12 6a6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6 6 6 0 0 1 6-6z"/>`,
  'arrow-forward-outline': `<line stroke-linecap="round" stroke-linejoin="round" x1="5" y1="12" x2="19" y2="12"/><polyline stroke-linecap="round" stroke-linejoin="round" points="12 5 19 12 12 19"/>`,
  'arrow-back-outline': `<line stroke-linecap="round" stroke-linejoin="round" x1="19" y1="12" x2="5" y2="12"/><polyline stroke-linecap="round" stroke-linejoin="round" points="12 19 5 12 12 5"/>`,
  'lock-closed-outline': `<rect stroke-linecap="round" stroke-linejoin="round" x="3" y="11" width="18" height="11" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  'mail-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline stroke-linecap="round" stroke-linejoin="round" points="22,6 12,13 2,6"/>`,
  'eye-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="12" r="3"/>`,
  'eye-off-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line stroke-linecap="round" stroke-linejoin="round" x1="1" y1="1" x2="23" y2="23"/>`,
  'person-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="7" r="4"/>`,
  'person-circle-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="7" r="4"/><circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="12" r="10"/>`,
  'settings-outline': `<circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="12" r="3"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
  'time-outline': `<circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="12" r="10"/><polyline stroke-linecap="round" stroke-linejoin="round" points="12 6 12 12 16 14"/>`,
  'flash-outline': `<polygon stroke-linecap="round" stroke-linejoin="round" points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
  'download-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline stroke-linecap="round" stroke-linejoin="round" points="7 10 12 15 17 10"/><line stroke-linecap="round" stroke-linejoin="round" x1="12" y1="15" x2="12" y2="3"/>`,
  'share-outline': `<circle stroke-linecap="round" stroke-linejoin="round" cx="18" cy="5" r="3"/><circle stroke-linecap="round" stroke-linejoin="round" cx="6" cy="12" r="3"/><circle stroke-linecap="round" stroke-linejoin="round" cx="18" cy="19" r="3"/><line stroke-linecap="round" stroke-linejoin="round" x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line stroke-linecap="round" stroke-linejoin="round" x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>`,
  'refresh-outline': `<polyline stroke-linecap="round" stroke-linejoin="round" points="23 4 23 10 17 10"/><path stroke-linecap="round" stroke-linejoin="round" d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>`,
  'layers-outline': `<polygon stroke-linecap="round" stroke-linejoin="round" points="12 2 2 7 12 12 22 7 12 2"/><polyline stroke-linecap="round" stroke-linejoin="round" points="2 17 12 22 22 17"/><polyline stroke-linecap="round" stroke-linejoin="round" points="2 12 12 17 22 12"/>`,
  'chevron-forward-outline': `<polyline stroke-linecap="round" stroke-linejoin="round" points="9 18 15 12 9 6"/>`,
  'chevron-back-outline': `<polyline stroke-linecap="round" stroke-linejoin="round" points="15 18 9 12 15 6"/>`,
  'checkmark-outline': `<polyline stroke-linecap="round" stroke-linejoin="round" points="20 6 9 17 4 12"/>`,
  'checkmark-circle-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline stroke-linecap="round" stroke-linejoin="round" points="22 4 12 14.01 9 11.01"/>`,
  'create-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path stroke-linecap="round" stroke-linejoin="round" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`,
  'log-out-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline stroke-linecap="round" stroke-linejoin="round" points="16 17 21 12 16 7"/><line stroke-linecap="round" stroke-linejoin="round" x1="21" y1="12" x2="9" y2="12"/>`,
  'log-in-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline stroke-linecap="round" stroke-linejoin="round" points="10 17 15 12 10 7"/><line stroke-linecap="round" stroke-linejoin="round" x1="15" y1="12" x2="3" y2="12"/>`,
  'camera-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="13" r="4"/>`,
  'cloud-upload-outline': `<polyline stroke-linecap="round" stroke-linejoin="round" points="16 16 12 12 8 16"/><line stroke-linecap="round" stroke-linejoin="round" x1="12" y1="12" x2="12" y2="21"/><path stroke-linecap="round" stroke-linejoin="round" d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>`,
  'image-outline': `<rect stroke-linecap="round" stroke-linejoin="round" x="3" y="3" width="18" height="18" rx="2"/><circle stroke-linecap="round" stroke-linejoin="round" cx="8.5" cy="8.5" r="1.5"/><polyline stroke-linecap="round" stroke-linejoin="round" points="21 15 16 10 5 21"/>`,
  'close-outline': `<line stroke-linecap="round" stroke-linejoin="round" x1="18" y1="6" x2="6" y2="18"/><line stroke-linecap="round" stroke-linejoin="round" x1="6" y1="6" x2="18" y2="18"/>`,
  'close-circle': `<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/><line stroke-linecap="round" stroke-linejoin="round" x1="15" y1="9" x2="9" y2="15"/><line stroke-linecap="round" stroke-linejoin="round" x1="9" y1="9" x2="15" y2="15"/>`,
  'add-outline': `<line stroke-linecap="round" stroke-linejoin="round" x1="12" y1="5" x2="12" y2="19"/><line stroke-linecap="round" stroke-linejoin="round" x1="5" y1="12" x2="19" y2="12"/>`,
  'add-circle-outline': `<circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="12" r="10"/><line stroke-linecap="round" stroke-linejoin="round" x1="12" y1="8" x2="12" y2="16"/><line stroke-linecap="round" stroke-linejoin="round" x1="8" y1="12" x2="16" y2="12"/>`,
  'images-outline': `<rect stroke-linecap="round" stroke-linejoin="round" x="5" y="5" width="14" height="14" rx="2"/><circle stroke-linecap="round" stroke-linejoin="round" cx="9" cy="9" r="1"/><polyline stroke-linecap="round" stroke-linejoin="round" points="19 15 14 10 5 19"/><path stroke-linecap="round" stroke-linejoin="round" d="M2 8v13a2 2 0 0 0 2 2h13"/>`,
  'trash-outline': `<polyline stroke-linecap="round" stroke-linejoin="round" points="3 6 5 6 21 6"/><path stroke-linecap="round" stroke-linejoin="round" d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/>`,
  'calendar-outline': `<rect stroke-linecap="round" stroke-linejoin="round" x="3" y="4" width="18" height="18" rx="2"/><line stroke-linecap="round" stroke-linejoin="round" x1="16" y1="2" x2="16" y2="6"/><line stroke-linecap="round" stroke-linejoin="round" x1="8" y1="2" x2="8" y2="6"/><line stroke-linecap="round" stroke-linejoin="round" x1="3" y1="10" x2="21" y2="10"/>`,
  'moon-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
  'language-outline': `<circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="12" r="10"/><line stroke-linecap="round" stroke-linejoin="round" x1="2" y1="12" x2="22" y2="12"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  'notifications-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path stroke-linecap="round" stroke-linejoin="round" d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
  'information-circle-outline': `<circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="12" r="10"/><line stroke-linecap="round" stroke-linejoin="round" x1="12" y1="16" x2="12" y2="12"/><line stroke-linecap="round" stroke-linejoin="round" x1="12" y1="8" x2="12.01" y2="8"/>`,
  'shield-checkmark-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline stroke-linecap="round" stroke-linejoin="round" points="9 12 11 14 15 10"/>`,
  'person-add-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="7" r="4"/><line stroke-linecap="round" stroke-linejoin="round" x1="19" y1="8" x2="19" y2="14"/><line stroke-linecap="round" stroke-linejoin="round" x1="22" y1="11" x2="16" y2="11"/>`,
  'warning-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line stroke-linecap="round" stroke-linejoin="round" x1="12" y1="9" x2="12" y2="13"/><line stroke-linecap="round" stroke-linejoin="round" x1="12" y1="17" x2="12.01" y2="17"/>`,
  'infinite-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/>`,
  'star-outline': `<polygon stroke-linecap="round" stroke-linejoin="round" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  'cube-outline': `<path stroke-linecap="round" stroke-linejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline stroke-linecap="round" stroke-linejoin="round" points="3.27 6.96 12 12.01 20.73 6.96"/><line stroke-linecap="round" stroke-linejoin="round" x1="12" y1="22.08" x2="12" y2="12"/>`,
  'checkmark-circle': `<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/><polyline stroke-linecap="round" stroke-linejoin="round" points="9 12 11 14 15 10"/>`,
};

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.viewBox]="'0 0 24 24'"
      fill="none"
      [attr.stroke]="'currentColor'"
      stroke-width="2"
      [innerHTML]="svgContent()"
      [style.width]="size()"
      [style.height]="size()"
      aria-hidden="true"
      style="display:inline-block;vertical-align:middle;flex-shrink:0"
    ></svg>
  `,
})
export class IconComponent {
  name = input<string>('');
  size = input<string>('1em');

  svgContent = computed(() => ICONS[this.name()] ?? '');
}
