import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.page.html',
  styleUrls: ['./coupon.page.scss'],
})
export class CouponPage implements OnInit {
  coupons = [1, 1, 1, 1, 1];

  constructor() { }

  ngOnInit() {
  }

}
