import { Component, AfterContentInit,ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs?:QueryList<TabComponent>

  constructor() { }

  ngAfterContentInit(): void {
    const activeTabs=this.tabs?.filter(
      tab=>tab.active
      )
    
      if(!activeTabs || activeTabs.length===0)
      {
        this.selectTab(this.tabs!.first)
      }
  }
  selectTab(tab: TabComponent){
    this.tabs?.forEach(tab=>{
      tab.active=false
    })

    tab.active=true
    return false  //preventDefault
  }
  /*
  hidingClass(tab: TabComponent){
    const hiding={
    'hover:text-indigo-400': !tab.active,
    'hover: text-white text-white bg-indigo-400' : tab.active
    }
  }*/
}
