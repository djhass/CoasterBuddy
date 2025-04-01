import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ParkDetailPage } from './park-detail.page';

describe('ParkDetailPage', () => {
  let component: ParkDetailPage;
  let fixture: ComponentFixture<ParkDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ParkDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
