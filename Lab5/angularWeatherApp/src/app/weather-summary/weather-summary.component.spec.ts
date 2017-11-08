import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherSummaryComponent } from './weather-summary.component';

describe('WeatherSummaryComponent', () => {
  let component: WeatherSummaryComponent;
  let fixture: ComponentFixture<WeatherSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
