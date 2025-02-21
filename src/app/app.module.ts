import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MasterBlockComponent } from './masterblock/masterblock.component';

@NgModule({
  declarations: [
    AppComponent,
    MasterBlockComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Import the HttpClientModule to enable HTTP requests
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
