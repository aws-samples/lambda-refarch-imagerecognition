import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from "./welcome.component";
import {PhotoComponent} from "./photos.component";
import {AlbumListComponent} from "./album-list.component";

const routes: Routes = [
  {path: '', redirectTo: '/welcome', pathMatch: 'full'},
  {path: 'welcome', component: WelcomeComponent},
  {path: 'albumlist', component: AlbumListComponent},
  {path: 'photos/:albumId', component: PhotoComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
