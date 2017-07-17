import {Component, NgZone, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/filter';
import {RxDevtoolsObservable} from './entities/rx-devtools-observable.entity';
declare const chrome;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  rxDevtoolsObservableData: RxDevtoolsObservable;

  constructor(private zone: NgZone) {
  }

  ngOnInit() {
    var backgroundPageConnection = chrome.runtime.connect();

    backgroundPageConnection.onMessage.addListener(this.runInZone.bind(this));

    backgroundPageConnection.postMessage({
      name: 'rx-devtools-page-init',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  }

  private runInZone(message, sender, sendResponse) {
    this.zone.run(() => this.processMesage(message, sender, sendResponse));
  }

  private processMesage(message, sender, sendResponse) {
    switch(message.name) {
      case 'ADD_OBSERVABLE':
        this.rxDevtoolsObservableData[message.value.id] = message.value.data;
    }
  };
}