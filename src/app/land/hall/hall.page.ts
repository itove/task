import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { AuthConstants } from '../../config/auth-constants';
import { StorageService } from '../../services/storage.service';
// import { Router, ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { DateAgoPipe } from '../../date-ago.pipe';

interface Data {
    [propName: string]: any;
}

@Component({
  selector: 'app-hall',
  templateUrl: './hall.page.html',
  styleUrls: ['./hall.page.scss'],
})
export class HallPage implements OnInit {
  page = 1;
  url = environment.url;
  // landId: number;
  sales = [];
  message: Data;
  userData: Data;
  orderType = 7;
  orderNote = '购买领地';

  constructor(
      // private activeRoute: ActivatedRoute,
      private toastService: ToastService,
      private storageService: StorageService,
      private router: Router,
      private httpService: HttpService,
      private data: DataService
  ) { }

  ngOnInit() {
      this.getSales();

      this.storageService.get(AuthConstants.AUTH).then((res) => {
          this.userData = res;
      });
  }

  buy(i){
      if (i.owner && i.owner.id === this.userData.id) {
          this.toastService.presentToast('您拥有领地 - ' + i.name);
          return;
      }
      const postData = {
          prePrice: i.price,
          ownerId: this.userData.id
      };
      const orderData = {
          type: this.orderType,
          note: this.orderNote,
          amount: i.price / 100,
          data: {
              entityId: i.id,
              postData
          }
      };
      this.message = {
          orderData
      };
      this.data.changeMessage(this.message);
      this.router.navigate(['/pay'], { replaceUrl: true });
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      this.page += 1;
      this.getSales();
    }, 500);
  }

  getSales(){
      this.httpService.get(`lands?page=${this.page}&itemsPerPage=10&forSale=true`).subscribe((res) => {
          this.sales = [...this.sales, ...res];
          console.log(res);
      });
  }
}
