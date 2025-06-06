import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TabsContainerComponent } from './tabs-container.component';
import { TabComponent } from '../tab/tab.component';
import { By } from '@angular/platform-browser';


@Component({
  template:`
    <app-tabs-container>
      <app-tab tabTitle="Tab 1">Tab1</app-tab>
      <app-tab tabTitle="Tab 2">Tab2</app-tab>
    </app-tabs-container>
  `,
})

class TestHostComponent{

}
describe('TabsContainerComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsContainerComponent,TabComponent, TestHostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 tabs',()=>{
    const tabs =fixture.debugElement.queryAll(By.css('li'))
    const containerComponent= fixture.debugElement.query(By.directive(TabsContainerComponent))
    const tabsProp  = containerComponent.componentInstance.tabs
    expect(tabs.length).withContext("Tabs did not render!").toBe(2)
    expect(tabsProp.length).withContext("could not grab components").toBe(2)
  })
});
