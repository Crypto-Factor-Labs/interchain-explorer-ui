import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialblockComponent } from './partialblock.component';

describe('PartialblockComponent', () => {
  let component: PartialblockComponent;
  let fixture: ComponentFixture<PartialblockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartialblockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartialblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
