import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterblocksComponent } from './masterblocks.component';

describe('MasterblocksComponent', () => {
  let component: MasterblocksComponent;
  let fixture: ComponentFixture<MasterblocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterblocksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterblocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
