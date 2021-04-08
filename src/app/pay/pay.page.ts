import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params, RoutesRecognized } from '@angular/router';
import {Location} from '@angular/common';
import { filter, pairwise } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';
import { HttpService } from '../services/http.service';
import { AuthConstants } from '../config/auth-constants';
import { StorageService } from '../services/storage.service';
import { Platform } from '@ionic/angular';
import { Wechat } from '@ionic-native/wechat/ngx';
import { ToastService } from '../services/toast.service';

interface Data {
    [propName: string]: any;
}

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
  amount: number;
  prevUrl: string;
  subscription: Subscription;
  message: Data;
  url: string;
  httpMethod: string;
  postData: Data;
  orderData: Data;
  userData: Data;
  availableBalance: number;
  payMethod = 0;

  constructor(
      private wechat: Wechat,
      private platform: Platform,
      private storageService: StorageService,
      private activeRoute: ActivatedRoute,
      private httpService: HttpService,
      private router: Router,
      private location: Location,
      private toastService: ToastService,
      private data: DataService
  ) { }

  ngOnInit() {
      this.subscription = this.data.currentMessage.subscribe(message => this.message = message);
      this.url = this.message.url;
      this.httpMethod = this.message.httpMethod;
      this.postData = this.message.postData;
      this.orderData = this.message.orderData;
      this.amount = this.orderData.amount;
      console.log(this.message);

      this.storageService.get(AuthConstants.AUTH).then((res) => {
          this.userData = res;
          this.httpService.get('users/' + this.userData.id).subscribe((res1) => {
              console.log(res1);
              this.user = res1;
              this.availableBalance = this.user.topup + this.user.earnings;
              if (this.availableBalance < this.amount) {
                  this.payMethod = 1;
              }
          });
      });

      // use service instead of query params
      // this.activeRoute.queryParams.subscribe((params: Params) => {
      //     this.amount = params.amount;
      // });

      // this.router.events.pipe(filter((e: any) => e instanceof RoutesRecognized),
      //                         pairwise()
      //                        ).subscribe((e: any) => {
      //                          this.prevUrl = e[0].urlAfterRedirects; // previous url
      //                          console.log(this.prevUrl);
      //                        });
  }

  pay() {
    if (this.payMethod === 0) { // balance
        this.orderData.user = '/api/users/' + this.userData.id;
        // console.log(this.url, this.postData, this.orderData);

        this.httpService.post('finances', this.orderData).subscribe((res) => {
            console.log(res);
            if (this.httpMethod === 'patch') {
                this.httpService.patch(this.url, this.postData).subscribe((res1) => {
                    console.log(res1);
                    this.toastService.presentToast(this.orderData.note + ' 支付完成');
                    this.location.back();
                });
            }
            else if (this.httpMethod === 'post') {
                this.httpService.post(this.url, this.postData).subscribe((res1) => {
                    console.log(res1);
                    this.toastService.presentToast(this.orderData.note + ' 支付完成');
                    this.location.back();
                });
            }

        });
        // this.router.navigate(['land/occupy'], {queryParams: {paid: 'n'}});
    }
    else { // wechat
        const data = {
            uid: this.userData.id,
            amount: this.amount,
            type: 4,
            note: this.orderData.note
        };
        this.httpService.post('prepayid', data).subscribe((res) => {
            console.log(res);
            const params = res;

            this.platform.ready().then(() => {
                this.wechat.sendPaymentRequest(params).then((res1) => {
                    console.log(params);
                    this.toastService.presentToast(this.orderData.note + ' 支付完成');
                    this.location.back();
                }, reason => {
                    console.log('failed : ', reason);
                });
            });
        });
    }
  }

  changePayMethod(e){
      this.payMethod = parseInt(e.detail.value, 10);
      console.log(this.payMethod);
  }
}
