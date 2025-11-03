import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CataloguePopupComponent } from './catalogue-popup.component';

describe('CataloguePopupComponent', () => {
  let component: CataloguePopupComponent;
  let fixture: ComponentFixture<CataloguePopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CataloguePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CataloguePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
