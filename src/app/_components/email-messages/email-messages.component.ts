import { Component, Input } from '@angular/core';
import { Models } from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-email-messages',
  templateUrl: './email-messages.component.html',
  styleUrls: ['./email-messages.component.scss']
})
export class EmailMessagesComponent {

  @Input() messages: Models.EmailMessagePreviewListing | undefined;

}
