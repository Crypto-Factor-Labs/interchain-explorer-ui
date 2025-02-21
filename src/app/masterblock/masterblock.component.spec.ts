import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterBlockComponent } from './masterblock.component';

describe('MasterBlockComponent', () => {
  let component: MasterBlockComponent;
  let fixture: ComponentFixture<MasterBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterBlockComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MasterBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
