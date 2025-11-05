import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightWidgetComponent } from './highlight-widget.component';

describe('HighlightWidgetComponent', () => {
  let component: HighlightWidgetComponent;
  let fixture: ComponentFixture<HighlightWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighlightWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
