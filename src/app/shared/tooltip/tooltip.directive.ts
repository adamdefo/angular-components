import {
  Directive,
  Injector,
  Input,
  ApplicationRef,
  ElementRef,
  ComponentRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  HostListener,
  ViewContainerRef
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { TooltipPosition, TooltipTheme } from './tooltip.enums';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {

  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private elRef: ElementRef,
    private cmptFactoryResolver: ComponentFactoryResolver
  ) {
  }

  @Input() tooltip: string = '';
  @Input() position: TooltipPosition = TooltipPosition.DEFAULT;
  @Input() theme: TooltipTheme = TooltipTheme.DEFAULT;
  @Input() showDelay: number = 0;
  @Input() hideDelay: number = 0;
 
  private cmptRef: ComponentRef<any> | null = null;
  private showTimeout?: number;
  private hideTimeout?: number;
  private touchTimeout?: number;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.init();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.setHideTooltipTimeout();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove($event: MouseEvent): void {
    if (this.cmptRef !== null && this.position === TooltipPosition.DYNAMIC) {
      this.cmptRef.instance.left = $event.clientX;
      this.cmptRef.instance.top = $event.clientY;
      this.cmptRef.instance.tooltip = this.tooltip;
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart($event: TouchEvent): void {
    $event.preventDefault();
    window.clearTimeout(this.touchTimeout);
    this.touchTimeout = window.setTimeout(this.init.bind(this), 500);
  }

  @HostListener('touchend')
  onTouchEnd(): void {
    window.clearTimeout(this.touchTimeout);
    this.setHideTooltipTimeout();
  }

  private init(): void  {
    if (this.cmptRef === null) {
      window.clearInterval(this.hideDelay);
      const componentFactory = this.cmptFactoryResolver.resolveComponentFactory(TooltipComponent);
      this.cmptRef = componentFactory.create(this.injector);

      this.appRef.attachView(this.cmptRef.hostView);
      const [tooltipDOMElement] = (this.cmptRef.hostView as EmbeddedViewRef<any>).rootNodes;

      this.setProperties();

      document.body.appendChild(tooltipDOMElement);
      this.showTimeout = window.setTimeout(this.show.bind(this), this.showDelay);
    }
  }

  private setProperties(): void  {
    if (this.cmptRef !== null) {
      this.cmptRef.instance.tooltip = this.tooltip;
      this.cmptRef.instance.position = this.position;
      this.cmptRef.instance.theme = this.theme;

      const {left, right, top, bottom} = this.elRef.nativeElement.getBoundingClientRect();

      switch (this.position) {
        case TooltipPosition.BOTTOM: {
          this.cmptRef.instance.left = Math.round((right - left) / 2 + left);
          this.cmptRef.instance.top = Math.round(bottom);
          break;
        }
        case TooltipPosition.TOP: {
          this.cmptRef.instance.left = Math.round((right - left) / 2 + left);
          this.cmptRef.instance.top = Math.round(top);
          break;
        }
        case TooltipPosition.RIGHT: {
          this.cmptRef.instance.left = Math.round(right);
          this.cmptRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        case TooltipPosition.LEFT: {
          this.cmptRef.instance.left = Math.round(left);
          this.cmptRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  private show(): void  {
    if (this.cmptRef !== null) {
      this.cmptRef.instance.visible = true;
    }
  }

  private setHideTooltipTimeout(): void {
    this.hideTimeout = window.setTimeout(this.destroy.bind(this), this.hideDelay);
  }

  destroy(): void {
    if (this.cmptRef !== null) {
      window.clearInterval(this.showTimeout);
      window.clearInterval(this.hideDelay);
      this.appRef.detachView(this.cmptRef.hostView);
      this.cmptRef.destroy();
      this.cmptRef = null;
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
