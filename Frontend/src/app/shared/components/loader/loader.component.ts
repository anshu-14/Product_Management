import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {


   @ViewChild('themeSample') themeSampleRef!: ElementRef;
  loaderColor: string = '#FF3D00'; 

 
}
