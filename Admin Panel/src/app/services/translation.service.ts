import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(
    private translate: TranslateService,
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
  }

  getSetLang() {
    let localLang = localStorage.getItem('userLang');
    if (localLang) {
      if (localLang == 'en') {
        this.translate.use('en');
      } else if (localLang == 'ar') {
        this.translate.use('ar');
      }
    } else {
      this.translate.use('en');
      localStorage.setItem('userLang', 'en');
    }
  }

  translateText(key) {
    let result = null;
    this.translate.get(key).subscribe((resp: string) => {
      result = resp;
    })
    return result;
  }

  get isRTL() {
    let result = false;
    let localLang = localStorage.getItem('userLang');
    if (localLang == 'en') {
      result = false;
    } else if (localLang == 'ar') {
      result = true;
    }
    return result;
  }

  get modalClass() {
    let result = 'model-ltr';
    let localLang = localStorage.getItem('userLang');
    if (localLang == 'en') {
      result = 'model-ltr';
    } else if (localLang == 'ar') {
      result = 'model-rtl';
    }
    return result;
  }

  changeLang(lang) {
    if (lang == 'en') {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      localStorage.setItem('userLang', 'en');
    } else if (lang == 'ar') {
      this.translate.setDefaultLang('ar');
      this.translate.use('ar');
      localStorage.setItem('userLang', 'ar');
    }
  }


}
