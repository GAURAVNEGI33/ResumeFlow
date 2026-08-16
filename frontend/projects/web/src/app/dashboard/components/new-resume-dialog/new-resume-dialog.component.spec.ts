import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResumeDialogComponent } from './new-resume-dialog.component';

describe('NewResumeDialogComponent', () => {
  let component: NewResumeDialogComponent;
  let fixture: ComponentFixture<NewResumeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewResumeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewResumeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
