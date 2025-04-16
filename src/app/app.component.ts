import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import grapesjs from 'grapesjs';
import Studio from '@grapesjs/studio-sdk';
import grapesjs from 'grapesjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'pizarra';
}
