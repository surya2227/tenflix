import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  currentMenu:any;
  @ViewChild('drawer') drawer:any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  setCurrentMenu(menuId:string){
    this.currentMenu=menuId;
    this.closeDrawer();
  }
  constructor(private breakpointObserver: BreakpointObserver) {}
  ngOnInit(): void {
      this.currentMenu='movies';
  }
  closeDrawer(){
    if(this.drawer._mode=='over'){
      this.drawer.close();
    }
  }
}
