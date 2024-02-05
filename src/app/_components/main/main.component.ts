import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AutoCompleteCompleteEvent, AutoCompleteOnSelectEvent } from 'primeng/autocomplete';
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
  filtersVisible: boolean = false;

  queues: Models.Queue[] = [];
  selectedQueues: Models.Queue[] = [];
  users: Models.User[] = [];
  selectedUsers: Models.User[] = [];

    

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
      { field: 'conversationStart', header: 'Date' },
      { field: 'remote', header: 'Remote' },
      { field: 'queue', header: 'Queue' },
      { field: 'users', header: 'Users' },
      { field: 'subject', header: 'Subject' }
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

    if (this.selectedQueues.length > 0) {
      let queuesFilter: Models.SegmentDetailQueryFilter = { type: 'or', predicates: [] };
      this.selectedQueues.forEach(e => {
        queuesFilter.predicates?.push({ dimension: 'queueId', value: e.id });
      });
      query.segmentFilters?.push(queuesFilter);
    }

    if (this.selectedUsers.length > 0) {
      let usersFilter: Models.SegmentDetailQueryFilter = { type: 'or', predicates: [] };
      this.selectedUsers.forEach(e => {
        usersFilter.predicates?.push({ dimension: 'userId', value: e.id });
      });
      query.segmentFilters?.push(usersFilter);
    }

    // TODO: Send query
    this.gcSvc.getConversations(query)
      .then(data => this.conversations = data.conversations!)
      .catch(err => console.error(err));
    this.dateDialogVisible = false;
  }

  displayData(conversation: Models.AnalyticsConversationWithoutAttributes, columnField: string): any {

    if (!conversation.participants) return '-';

    switch(columnField) {
      case 'originatingDirection': return conversation.originatingDirection;
      case 'conversationStart': return new Date(conversation.conversationStart!).toLocaleString();
      case 'queue':
        const foundAcd = conversation.participants.filter(e => e.purpose === 'acd');
        if (foundAcd.length === 0) return '-';
        return foundAcd.map(e => e.participantName).toString();
      case 'users':
        const foundUsers = conversation.participants.filter(e => e.purpose === 'agent');
        if (foundUsers.length === 0) return '-';
        return foundUsers.map(e => e.participantName).toString();
      case 'remote':
        const externalParticipant = conversation.participants?.find(e => e.purpose === 'external' || 'customer');
        if (externalParticipant) {
          return externalParticipant.participantName;
        }
        return '';
      case 'duration': return '';
      case 'subject':
        if (!conversation.participants[0].sessions || !conversation.participants[0].sessions[0].segments) return '-';
        return conversation.participants[0].sessions[0].segments[0].subject ? conversation.participants[0].sessions[0].segments[0].subject : '-';
      default: return '';
    }

  }

  getIntervalLabel(): string {
    const dateOpts: Intl.DateTimeFormatOptions = { hour12: false, hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
    return `${this.dateFrom.toLocaleString('pl-PL', dateOpts)} - ${this.dateTo.toLocaleString('pl-PL', dateOpts)}`;
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  onQueueSearch(event: AutoCompleteCompleteEvent) {
    console.log(`(onQueueSelect) query: ${event.query}`);
    this.gcSvc.getQueues({ name: `*${event.query}*` })
      .then(d => this.queues = d.entities ? d.entities.filter(e => !this.selectedQueues.find(f => f.id === e.id)) : [])
      .catch(err => console.error(err));
  }

  onQueueSelect(event: AutoCompleteOnSelectEvent) {
    console.log(`(onQueueSelect)`, event);
    // Prevent duplicates
    const found = this.selectedQueues.find(e => e.id === event.value.id);
    if (!found) this.selectedQueues.push(event.value);
  }

  onUserSearch(event: AutoCompleteCompleteEvent) {
    console.log(`(onUserSearch) query: ${event.query}`);
    this.gcSvc.searchUsers({ query: [{ type: 'QUERY_STRING', value: event.query, fields: ['name'] }] })
      .then(d => this.users = d.results.filter(e => !this.selectedUsers.includes(e)))
      .catch(err => console.error(err));
  }

  onUserSelect(event: AutoCompleteOnSelectEvent) {
    console.log(`(onUserSelect)`, event);
    // Prevent duplicates
    const found = this.selectedUsers.find(e => e.id === event.value.id);
    if (!found) this.selectedUsers.push(event.value);
  }

  removeItem(where: any[], item: any) {
    where.splice(where.indexOf(item), 1);
  }

}
