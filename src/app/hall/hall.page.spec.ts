import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HallPage } from './hall.page';

describe('HallPage', () => {
  let component: HallPage;
  let fixture: ComponentFixture<HallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HallPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
