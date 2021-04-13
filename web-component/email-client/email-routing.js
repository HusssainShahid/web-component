import {HistoryApi} from "../../history-api/history-api";

export class EmailRouting extends HistoryApi {

  constructor() {
    super();
    this.href = window.location.origin;
    for (let i = 0; i < 4; i++) {
      this.href=this.href+window.location.pathname.split('/')[i]+'/';
    }
  }

  pushRoute(route) {
    this.pushUrl(route,this.href +route);
  }
}
