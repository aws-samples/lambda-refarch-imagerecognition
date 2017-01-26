import {Component, OnInit} from '@angular/core';
import {LoginService} from "./login.service";
import {Router} from "@angular/router";
import {AlbumInfoService} from "./album-info.service";
import {Album} from "./album";

@Component({
  selector: 'album-list',
  moduleId: module.id,
  templateUrl: 'album-list.component.html',
  styleUrls: ['album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  albums: Album[];
  isCreating: boolean;
  albumName: string;
  errorMsg: string;

  constructor(private router: Router,
              private loginService: LoginService,
              private albumInfoService: AlbumInfoService) {
    loginService.getLoggedInUserObservable.subscribe(user => {
      if (!user || user.length === 0) {
        this.router.navigateByUrl("/welcome");
      }
    });
  }

  ngOnInit(): void {
    this.refreshAlbumList();
  }

  private refreshAlbumList() {
    if (this.loginService.isUserLoggedin()) {
      let promise = this.albumInfoService.listAlbums(this.loginService.getLoggedInUserName());
      promise.then(data => {
        this.albums = data;
      });
    }
  }

  createAlbum(albumName: string): void {
    this.isCreating = true;
    this.errorMsg = null;
    let promise = this.albumInfoService.createAlbum(albumName, this.loginService.getLoggedInUserName());
    promise.then(data => {
      this.refreshAlbumList();
      this.isCreating = false;
    }).catch(err => {
      this.errorMsg = err.toString();
      this.isCreating = false;
    });
  }

  goToAlbum(album: any): void {
    this.router.navigate(["/photos", album.albumID]);
  }

}
