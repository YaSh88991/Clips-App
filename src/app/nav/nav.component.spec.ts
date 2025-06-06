import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from "@angular/router/testing"
import { NavComponent } from './nav.component';


describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  const mockAuthService=jasmine.createSpyObj('AuthService',[
    'createUser','logout'
  ],{
    isAuthenticated$: of(true),
  });


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavComponent ],
      imports:[RouterTestingModule],
      providers:[
        {provide : AuthService , useValue: mockAuthService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should Logout',()=>{
    const logoutLink= fixture.debugElement.query(By.css('li:nth-child(3) a') )
    expect(logoutLink).withContext('Not Logged In').toBeTruthy();
    logoutLink.triggerEventHandler('click')
    const service = TestBed.inject(AuthService)
    expect(service.logout).withContext('Could not click logout Link')
    .toHaveBeenCalledTimes(1);
  })
});
