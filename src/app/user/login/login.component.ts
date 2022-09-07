import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {



  credentials={
      email: '',
      password: ''
  }
  constructor(
    private auth : AngularFireAuth
  ) { }

  ngOnInit(): void {
  }

  showAlert=false
  alertMsg='Please wait! we are logging you in '
  alertColor='blue'
  inSubmission=false

  async login(
  ){
    this.showAlert=true
    this.alertMsg='Please wait! while we log you in'
    this.alertColor ='blue'
    this.inSubmission = true

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,this.credentials.password
      )
      
    } catch (e) {
      console.log(e); //for debugging
      this.alertMsg='An unexpected error occoured.Please try again later '
      this.alertColor='red'
      this.inSubmission=false
      return 
    }
    this.alertMsg='Logged in successfully!!.'
    this.alertColor='green'
  }

}
