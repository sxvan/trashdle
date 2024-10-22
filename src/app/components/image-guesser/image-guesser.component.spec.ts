import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGuesserComponent } from './image-guesser.component';

describe('ImageGuesserComponent', () => {
  let component: ImageGuesserComponent;
  let fixture: ComponentFixture<ImageGuesserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGuesserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageGuesserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
