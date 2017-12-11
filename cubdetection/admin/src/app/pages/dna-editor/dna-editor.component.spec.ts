import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaEditorComponent } from './dna-editor.component';

describe('NewsEditorComponent', () => {
  let component: DnaEditorComponent;
  let fixture: ComponentFixture<DnaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DnaEditorComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
