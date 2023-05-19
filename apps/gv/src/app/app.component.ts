import {
  Component,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { loadRemoteModule } from '@nx/angular/mf';
import { ViewStateService } from '@conx-mfe/shared/data-access-user';

@Component({
  selector: 'conx-mfe-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('placeHolder', { read: ViewContainerRef, static: true })
  viewContainer!: ViewContainerRef;

  constructor(public viewStateService: ViewStateService) {}

  async ngOnInit() {
    this.viewContainer.clear();

    const Component = await loadRemoteModule('login', './Login2').then(
      (m) => m['Login2Component']
    );

    this.viewContainer.createComponent(Component);

    this.viewStateService.closePassport$.subscribe(() => {
      //if() check this window-tab active mode
      if (window.location.pathname == '/passport') {
        window.close();
      }
    });
  }

  openPassport() {
    this.viewStateService.openPassport();
  }
  closePassport() {
    this.viewStateService.closePassport();
  }
}
