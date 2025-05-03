import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[longPress]'
})
export class LongPressDirective {
  @Output() longPress = new EventEmitter<void>();
  pressTimer: any;

  @HostListener('mousedown') onMouseDown() {
    this.startPress();
  }

  @HostListener('touchstart') onTouchStart() {
    this.startPress();
  }

  @HostListener('mouseup') onMouseUp() {
    this.endPress();
  }

  @HostListener('touchend') onTouchEnd() {
    this.endPress();
  }

  startPress() {
    this.pressTimer = setTimeout(() => {
      this.longPress.emit(); // Emit the long press event
    }, 1000); // Adjust duration as needed
  }

  endPress() {
    clearTimeout(this.pressTimer); // Clear the timer
  }
}