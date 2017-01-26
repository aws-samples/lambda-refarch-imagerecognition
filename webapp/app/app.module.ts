import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent}  from './app.component';
import {LoginService} from './login.service';
import {WelcomeComponent} from './welcome.component';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AlbumInfoService} from './album-info.service';
import {AlbumListComponent} from './album-list.component';
import {PhotoComponent} from './photos.component';
import {S3Service} from './s3.service';
import {StepFunctionService} from './stepfunction.service';
import {RoundPipe} from './round.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule],
  declarations: [
    AppComponent,
    WelcomeComponent,
    AlbumListComponent,
    PhotoComponent,
    RoundPipe],
  providers: [
    LoginService,
    AlbumInfoService,
    S3Service,
    StepFunctionService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
