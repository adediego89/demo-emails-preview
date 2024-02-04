import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TableRowExpandEvent } from 'primeng/table';
import { Models } from 'purecloud-platform-client-v2';
import { GenesysCloudService } from 'src/app/_services/genesys-cloud.service';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  
  items: MenuItem[] | undefined;
  conversationId: string | undefined;
  messages: Models.EmailMessagePreviewListing | undefined;
  conversations: Models.AnalyticsConversationWithoutAttributes[] = [];
  cols: Column[] = [];

  dateFrom: Date = new Date();
  dateTo: Date = new Date();

  dateDialogVisible: boolean = false;

    

  constructor(private readonly gcSvc: GenesysCloudService) {}

  ngOnInit(): void {

    this.dateFrom.setHours(0, 0, 0);
    this.dateTo.setDate(this.dateFrom.getDate() + 1);
    this.dateTo.setHours(0, 0, 0);
    
    this.items = [
      { label: 'ByConversationId' },
      { label: 'Analytics' }
    ];

    this.cols = [
      { field: 'originatingDirection', header: 'Direction' },
      { field: 'conversationStart', header: 'Date' },
      { field: 'queue', header: 'Queue' },
      { field: 'users', header: 'Users' },
      { field: 'remote', header: 'Remote' },
      { field: 'duration', header: 'Conversation Duration' }
  ];

  }

  findMessages() {
    console.log('Executing findMessages');
    if (!this.conversationId) return;
    this.gcSvc.getConversationEmailMessages(this.conversationId)
      .then(data => this.messages = data)
      .catch(err => console.error(err));
  }

  onRowExpand(event: TableRowExpandEvent) {
    console.log('onRowExpand', event);

    this.gcSvc.getConversationEmailMessages(event.data.conversationId)
      .then(data => event.data.messages = data)
      .catch(err => console.error(err))
      .then(() => event.data.dataLoaded = true);
  }

  showDialog() {
    this.dateDialogVisible = true;
  }

  findConversations() {
    console.log(`Executing findConversations. Interval: ${this.dateFrom.toISOString()}/${this.dateTo.toISOString()}`);
    // TODO: Build query
    let query: Models.ConversationQuery = {
      interval: `${this.dateFrom.toISOString()}/${this.dateTo.toISOString()}`,
      order: "desc",
      orderBy: "conversationStart",
      segmentFilters: [
        {
          type: 'or',
          predicates: [
            { dimension: 'mediaType', value: 'email' }
          ]
        }
      ]
    };
    // TODO: Send query
    this.gcSvc.getConversations(query)
      .then(data => this.conversations = data.conversations!)
      .catch(err => console.error(err));
    this.dateDialogVisible = false;
  }

  displayData(conversation: Models.AnalyticsConversationWithoutAttributes, columnField: string): any {

    switch(columnField) {
      case 'originatingDirection': return conversation.originatingDirection;
      case 'conversationStart': return conversation.conversationStart;
      case 'queue': return '';
      case 'users': return '';
      case 'remote':
        const externalParticipant = conversation.participants?.find(e => e.purpose === 'external' || 'customer');
        if (externalParticipant) {
          return externalParticipant.participantName;
        }
        return '';
      case 'duration': return '';
    }

  }

}
