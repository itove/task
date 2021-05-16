import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';
import { AuthConstants } from '../../config/auth-constants';
import { StorageService } from '../../services/storage.service';

interface Data {
    [propName: string]: any;
}

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.page.html',
  styleUrls: ['./exchange.page.scss'],
})
export class ExchangePage implements OnInit {
  rate: number;
  total: number;
  remain: number;
  taken: number;
  equity: number;
  userData: Data;
  user: Data;
  node: Data;
  conf: Data;

  constructor(
      private storageService: StorageService,
      private httpService: HttpService
  ) {
      this.remain = 0;
      this.taken = 0;
  }

  ngOnInit() {
      this.storageService.get(AuthConstants.AUTH).then(
          (res) => {
              this.userData = res;
          });
      this.httpService.get('nodes/9').subscribe((res) => {
          this.node = res;
      });
  }

  ionViewWillEnter(){
      this.httpService.get('users/' + this.userData.id).subscribe((res1) => {
          this.user = res1;
          this.equity = this.user.equity;
      });

      this.httpService.get('confs/1').subscribe((res) => {
          console.log(res);
          this.conf = res;
          this.total = this.conf.equity;
          this.rate = this.conf.equityGXBRate;
      });
  }

}
