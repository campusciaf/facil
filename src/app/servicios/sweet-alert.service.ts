import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() {
    this.setupMutationObserver();
  }

  private setupMutationObserver() {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const unwantedStyle = Array.from(document.styleSheets).find(styleSheet => {
            return Array.from(styleSheet.rules || []).find(rule => rule.cssText.includes('.swal2-height-auto'));
          });
          
          if (unwantedStyle) {
            const index = Array.from(unwantedStyle.cssRules).findIndex(rule => rule.cssText.includes('.swal2-height-auto'));
            if (index > -1) {
              unwantedStyle.deleteRule(index);
            }
          }
        }
      }
    });

    observer.observe(document.head, { childList: true });
  }
}
