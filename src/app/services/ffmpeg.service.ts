import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isRunning = false
  isReady=false
  private ffmpeg

  constructor() {
    this.ffmpeg=createFFmpeg({log : true })
   }

  async init(){
    if(this.isReady){
      return
    }

    await this.ffmpeg.load()
    this.isReady=true
  }

  async getScreenshot(file : File){
    this.isRunning=true
    const data= await fetchFile(file)  //convert file to binary data
    this.ffmpeg.FS('writeFile',file.name,data)

    const seconds = [1,3,5]
    const commands : string[] =[]

    seconds.forEach(second =>{
      commands.push(
        //Input
        '-i', file.name,
        //Output Options
        '-ss' , `00:00:0${second}`,
        '-frames:v','1','-filter:v','scale=510:-1',
        //Output
        `output_0${second}.png`
      )
    })

    await this.ffmpeg.run(
      ...commands
    )

    const screenshots : string[] = []
    
    seconds.forEach(second=>{
      const screeshotFile = this.ffmpeg.FS('readFile',`output_0${second}.png`)
      const screeshotBlob = new Blob(
        [screeshotFile.buffer],{
          type: 'image/png'
        }
      )
      const screenshotURL = URL.createObjectURL(screeshotBlob)
      
      screenshots.push(screenshotURL)
   
    })
    this.isRunning=false
    return screenshots
  }
  
  async blobFromURL( url : string){
    const response = await fetch(url)
    const blob = await response.blob()

    return blob
  }
}
