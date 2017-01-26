import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoginService} from './login.service';
import {Router} from '@angular/router';
import {AlbumInfoService} from './album-info.service';
import {ActivatedRoute}   from '@angular/router';
import {S3Service} from './s3.service';
import {CONFIG} from './config';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first' ;
import 'rxjs/add/operator/map';
import {StepFunctionService} from './stepfunction.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'photos',
  moduleId: module.id,
  templateUrl: 'photos.component.html',
  styleUrls: ['photos.component.css']
})

export class PhotoComponent implements OnInit, OnDestroy {

  private albumID: string;
  private sub: any;
  private fileSelected: any;
  private photos: any[];
  private isProcessingUpload: boolean;
  private s3UploadFailure: boolean;
  private timeoutPollingExecutionArn: boolean;
  private doneUploading: boolean;
  private executionArn: string;
  private executionStatus: string;

  ngOnInit(): void {
    this.loginService.getLoggedInUserObservable.subscribe(user => {
      if (!user || user.length === 0) {
        this.router.navigateByUrl("/welcome");
      }
    });
    this.sub = this.route.params.subscribe(params => {
      this.albumID = params['albumId'];
      this.refreshPhotos();
    });
  }

  private refreshPhotos() {
    let promise = this.albumInfoService.listPhotos(this.albumID);
    promise.then(data => {
      this.photos = data.Items;
      for (let i = 0; i < this.photos.length; i++) {
        this.photos[i].url = this.s3uploadService.getDownloadPresignedUrl({
          Bucket: CONFIG.S3PhotoRepoBucket,
          Key: "Thumbnail/" + this.photos[i].imageID
        });
      }
    });
  }

  constructor(private router: Router,
              private loginService: LoginService,
              private route: ActivatedRoute,
              private albumInfoService: AlbumInfoService,
              private s3uploadService: S3Service,
              private stepFunctionService: StepFunctionService) {
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }


  fileChangeEvent(fileInput: any): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.fileSelected = fileInput.target.files[0];
      console.log(fileInput.target.files[0]);
    }
  }

  upload(): void {
    if (!this.fileSelected) {
      return;
    }

    this.isProcessingUpload = true;
    this.doneUploading = false;
    this.executionArn = null;
    this.executionStatus = null;
    this.s3UploadFailure = false;
    this.timeoutPollingExecutionArn = false;

    const metadata = {
      userid: this.loginService.getLoggedInUserName(),
      albumid: this.albumID
    };

    const objectID = this.generateObjectID();

    let params: any = {
      Metadata: metadata,
      Key: "Incoming/" + objectID,
      Bucket: CONFIG.S3PhotoRepoBucket,
      Body: this.fileSelected
    };

    const contentType = this.inferContentType();
    if (contentType) {
      params.ContentType = contentType;
    }

    this.s3uploadService.upload(params).then((data: any) => {
      this.doneUploading = true;
      this.pollExecutionArn(objectID);
    }).catch((err: any) => {
      this.reset();
      this.doneUploading = true;
      this.s3UploadFailure = true;
      console.log(err);
    });
  }

  pollExecutionArn(imageID: string): void {
    const interval = IntervalObservable.create(1000);
    const arnObservable = interval.switchMap(() => this.albumInfoService.getInfo(imageID))
      .filter((item) => (item && item.hasOwnProperty('executionArn')))
      .map((item) => (item.executionArn))
      .timeout(8000) // 8 seconds
      .first();
    arnObservable.subscribe((arn) => {
      this.executionArn = arn;
      this.pollExecutionStatus(arn);
    }, (err) => {
      if (err.name && err.name === "TimeoutError") {
        this.timeoutPollingExecutionArn = true;
        this.reset();
      }
    });
  }

  pollExecutionStatus(executionArn: string): void {
    let polling: Subscription;
    let successPromise = new Promise((resolve, reject) => {
      polling = IntervalObservable.create(1000)
        .switchMap(() => this.stepFunctionService.checkExecutionStatus(executionArn))
        .subscribe((status) => {
          this.executionStatus = status;
          if (status !== "RUNNING") {
            resolve();
          }
        });
    });
    successPromise.then(() => {
      if (polling) {
        polling.unsubscribe();
      }
      this.reset();
    });
  }

  private reset() {
    this.isProcessingUpload = false;
    this.fileSelected = null;
    this.refreshPhotos();
  }

  getInfo(photo: any): void {
    this.albumInfoService.getInfo(photo.imageID).then((data: any) => {
      console.log(data);
    });
  }

  private generateObjectID() {
    return ("" + new Date().getTime()).split("").reverse().join("")
      + "-" + this.albumID
      + "-" + this.fileSelected.name;
  }

  private inferContentType(): string {
    // Infer the image type.
    const typeMatch = this.fileSelected.name.match(/\.([^.]*)$/);
    if (typeMatch) {
      const imageType = typeMatch[1];
      if (imageType === "jpeg" || imageType === "jpg") {
        return "image/jpeg";
      } else if (imageType === "png") {
        return "image/png";
      }
    }
    return null;
  }
}
