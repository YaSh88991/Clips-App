import { Component, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { stringify, v4 as uuid } from 'uuid'
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

  isDragOver = false
  file: File | null = null
  isVisible = false
  showAlert = false
  alertMsg = 'Please wait! your clip is being uploaded '
  alertColor = 'blue'
  inSubmission = false
  percentage = 0
  showPercentage = false
  user: firebase.User | null = null
  task ?: AngularFireUploadTask
  screenshots:string[] = []
  selectedScreenshot= ''
  screenshotTask?: AngularFireUploadTask

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })

  uploadForm = new FormGroup({
    title: this.title
  })


  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService : ClipService,
    private router : Router,
    public ffmpegService : FfmpegService
  ) {
    auth.user.subscribe(user =>this.user = user)
    this.ffmpegService.init()

  }

  ngOnDestroy(): void {  
    this.task?.cancel()
  }

  async storeFile($event: Event) {
    if(this.ffmpegService.isRunning){
      return
    }


    this.isDragOver = false
    this.file = ($event as DragEvent).dataTransfer?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null:
      ($event.target as HTMLInputElement).files?.item(0) ?? null
    
      if (!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.screenshots= await this.ffmpegService.getScreenshot(this.file)
    this.selectedScreenshot=this.screenshots[0]
    
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    this.isVisible = true
    //console.log(this.file);
  }

 async uploadFile() {
    this.uploadForm.disable()

    this.showAlert = true
    this.alertMsg = 'Please wait! your clip is being uploaded'
    this.alertColor = 'blue'
    this.inSubmission = true
    this.showPercentage = true
    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

    const screenshotBlob= await this.ffmpegService.blobFromURL(this.selectedScreenshot)
    const screenshotPath = `screenshots/${clipFileName}.png`

    this.task = this.storage.upload(clipPath, this.file)
    const clipRef= this.storage.ref(clipPath)  //refrence
    const screenshotRef= this.storage.ref(screenshotPath)

    this.screenshotTask=this.storage.upload(screenshotPath, screenshotBlob)
    
    combineLatest([this.task .percentageChanges(), 
      this.screenshotTask.percentageChanges()
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress]= progress

      if(!clipProgress || !screenshotProgress){
        return
      }

      const total = clipProgress+screenshotProgress

      this.percentage = total as number / 200
    })

    forkJoin([
      this.task .snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ]).pipe(
      switchMap(() => forkJoin([
        clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ]))
    ).subscribe({
      next: async (urls) => {
        const [clipURL , screenshotURL]=urls
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title : this.title.value,
          fileName : `${clipFileName}.mp4`,
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          timestamp : firebase.firestore.FieldValue.serverTimestamp()
        }
        const clipDocRef = await this.clipsService.createClip(clip)
        console.log(clip);
        

        this.alertColor = 'green'
        this.alertMsg = 'Success! your clip is now ready to share with the world.'
        this.showPercentage = false

        setTimeout(()=>{
            this.router.navigate([
              'clip',clipDocRef.id
            ])
        }
        ,1000)
      },
      error: (error) => {
        this.uploadForm.enable()
        this.alertColor = 'red'
        this.alertMsg = 'Upload Failed :( Please try again!'
        this.inSubmission = true
        this.showPercentage = false
        console.log(error);

      }
    });


  }
}
