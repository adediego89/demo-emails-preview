import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMessagesComponent } from './email-messages.component';

describe('EmailMessagesComponent', () => {
  let component: EmailMessagesComponent;
  let fixture: ComponentFixture<EmailMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailMessagesComponent]
    });
    fixture = TestBed.createComponent(EmailMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
