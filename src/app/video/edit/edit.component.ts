import { Component, OnDestroy, OnInit,
   Input, OnChanges, Output, EventEmitter} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit , OnDestroy, OnChanges {
  @Input() activeClip : IClip | null = null

  showAlert = false
  alertMsg = 'Updating your clip!'
  alertColor = 'blue'
  inSubmission = false
  @Output() update = new EventEmitter()

  clipID =new FormControl('', {
    nonNullable: true
  })

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })

  editForm = new FormGroup({
    title: this.title,
    id : this.clipID
  })


  constructor(private modal : ModalService, private clipService: ClipService) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  ngOnChanges(){
    if (!this.activeClip) {
      return
    }
    this.inSubmission=false
    this.showAlert=false
    this.clipID.setValue(this.activeClip.docID as string)
    this.title.setValue(this.activeClip.title)
  }

  async submit(){
    if(!this.activeClip){
      return
    }
    this.inSubmission=true
    this.showAlert=true
    this.alertColor='blue'
    this.alertMsg='Updating your Clip!'

    try{
    await this.clipService.updateClip(this.clipID.value,this.title.value)
    }
    catch(e){
      this.inSubmission=false
      this.alertColor='red'
      this.alertMsg='Oops! Try Again '
      
      return

  }

  this.activeClip.title=this.title.value
  this.update.emit(this.activeClip)

  this.inSubmission=false
  this.alertColor='green'
  this.alertMsg='Title Updated Successfully!'

}
}