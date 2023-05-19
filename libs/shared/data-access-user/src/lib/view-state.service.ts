import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ViewStateService {
  name$ = new BehaviorSubject('');
  closePassport$ = new Subject();
  /**
   *
   */
  constructor(private router: Router) {
    this.registerEvents();
  }

  changeName(name: string) {
    window.localStorage.setItem('gv_name', name);
  }
  private registerEvents(): void {
    window.addEventListener('storage', (event) => {
      console.log(event);
      if (event.storageArea != localStorage) return;
      if (event.key === 'gv_name') {
        this.name$.next(event.newValue as string);
      }
      if (event.key === 'gv_closepassport') {
        this.closePassport$.next(true);
      }
    });

    this.name$.next(window.localStorage.getItem('gv_name') || '');
  }

  openPassport() {
    // Converts the route into a string that can be used
    // with the window.open() function
    const url = this.router.serializeUrl(
      //this.router.createUrlTree([`/passport/${city.id}`])
      this.router.createUrlTree([`/passport`])
    );

    window.open(
      url,
      'new-window' + `${new Date().getTime()}`,
      'width=600,height=600'
    );

    //https://web.dev/learn/pwa/windows/#:~:text=Opening%20new%20windows%20%23&text=From%20the%20menu%20in%20the,Check%20the%20documentation%20for%20details.

    //window.open(url, '_blank');
  }
  closePassport() {
    window.localStorage.setItem('gv_closepassport', `${new Date().getTime()}`);
  }
}
