import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterBlocksComponent } from './masterblocks.component';

describe('MasterblocksComponent', () => {
  let component: MasterBlocksComponent;
  let fixture: ComponentFixture<MasterBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterBlocksComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MasterBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
