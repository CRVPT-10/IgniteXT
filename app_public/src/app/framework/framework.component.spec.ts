import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the new, correct component class name
import { FrameworkComponent } from './framework.component';

describe('FrameworkComponent', () => {
  // Update all references from 'Framework' to 'FrameworkComponent'
  let component: FrameworkComponent;
  let fixture: ComponentFixture<FrameworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
