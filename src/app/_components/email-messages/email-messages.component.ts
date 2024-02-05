import { Component, Input, OnInit } from '@angular/core';
import { Models } from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-email-messages',
  templateUrl: './email-messages.component.html',
  styleUrls: ['./email-messages.component.scss']
})
export class EmailMessagesComponent implements OnInit{
  ngOnInit(): void {
    if (!this.messages || !this.messages.entities) return;
    this.messages?.entities[0].to.push({ name: 'somebody', email: 'somebody@asd.pl'});
  }

  @Input() messages: Models.EmailMessagePreviewListing | undefined;

  getDateString(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleString();
  }

}
