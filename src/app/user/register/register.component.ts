import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
  constructor(
    private auth: AuthService,
    private emailTaken : EmailTaken
    ){
  }

   inSubmission=false

  name= new FormControl('',[
  Validators.required,
  Validators.minLength(3), 
  ])
  email =new FormControl('',
  [
    Validators.email,
    Validators.required
  ],[this.emailTaken.validate])
  age = new FormControl<number | null>(null,[
    Validators.min(18),
    Validators.required,
    Validators.max(120)
  ])
  password= new FormControl('',[
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirmPassword= new FormControl('',[
    Validators.required
  ])
  phoneNumber= new FormControl('',[
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(13)
  ])

  showAlert=false
  alertMsg='Please wait! your account is being created '
  alertColor='blue'


  registerForm=new FormGroup({
    name: this.name,
    email :this.email,
    age : this.age,
    password:this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber

  },[RegisterValidators.match('password','confirmPassword')])

  async register(){
    this.showAlert=true
    this.alertMsg='Please wait! your account is being created'
    this.alertColor ='blue'
    this.inSubmission = true
    
    try{
      await this.auth.createUser(this.registerForm.value as IUser)
    }catch(e){
      console.log(e);
      this.alertMsg='An unexpected error occoured.Please try again later '
      this.alertColor='red'
      this.inSubmission=false
      return 
    }
    this.alertMsg='Hooray! Your account has been created.'
    this.alertColor='green'

  }


}
