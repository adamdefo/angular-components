import { Component, HostListener } from '@angular/core';
import { TooltipPosition, TooltipTheme } from './shared/tooltip/tooltip.enums';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Angular Components!';

  ttpPosition = TooltipPosition;
  ttipTheme = TooltipTheme;
  x = 0;
  y = 0;
  coordinates = '';

  @HostListener('mousemove', ['$event'])
  onMouseMove($event: MouseEvent): void {
      this.x = $event.clientX;
      this.y = $event.clientY;
      this.coordinates = `${this.x},${this.y}`;
  }

}
