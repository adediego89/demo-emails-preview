import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
// Routing
import { AppRoutingModule } from './app-routing.module';
// Components
import { AppComponent } from './app.component';
import { MainComponent } from './_components/main/main.component';
// Guards
import { AuthGuard } from './_guards/auth.guard';
// UI - Primeng
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { EmailMessagesComponent } from './_components/email-messages/email-messages.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    EmailMessagesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    TabViewModule,
    InputTextModule,
    ButtonModule,
    AccordionModule,
    TableModule,
    CalendarModule,
    DialogModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
