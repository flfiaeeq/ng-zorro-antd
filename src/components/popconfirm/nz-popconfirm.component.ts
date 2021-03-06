import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FadeAnimation } from '../core/animation/fade-animations';
import { NzToolTipComponent } from '../tooltip/nz-tooltip.component';
import { toBoolean } from '../util/convert';
import { NzLocaleService } from '../locale/index';

@Component({
  selector     : 'nz-popconfirm',
  encapsulation: ViewEncapsulation.None,
  animations   : [
    FadeAnimation
  ],
  template     : `
    <ng-content></ng-content>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="overlayOrigin"
      [cdkConnectedOverlayHasBackdrop]="_hasBackdrop"
      (backdropClick)="hide()"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="visible$ | async">
      <div class="ant-popover" [ngClass]="_classMap" [ngStyle]="nzOverlayStyle" [@fadeAnimation]="''+(visible$ | async)"
        (@fadeAnimation.done)="_afterVisibilityAnimation($event)">
        <div class="ant-popover-content">
          <div class="ant-popover-arrow"></div>
          <div class="ant-popover-inner">
            <div>
              <div class="ant-popover-inner-content">
                <div class="ant-popover-message" *ngIf="!nzTemplate">
                  <i class="anticon anticon-exclamation-circle"></i>
                  <div class="ant-popover-message-title">{{nzTitle}}</div>
                </div>
                <div class="ant-popover-buttons" *ngIf="!nzTemplate">
                  <button nz-button [nzSize]="'small'" (click)="onCancel()"><span>{{nzCancelText}}</span></button>
                  <button nz-button [nzSize]="'small'" [nzType]="'primary'" (click)="onConfirm()">
                    <span>{{nzOkText}}</span></button>
                </div>
                <ng-template
                  *ngIf="nzTemplate"
                  [ngTemplateOutlet]="nzTemplate">
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>`,
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})
export class NzPopconfirmComponent extends NzToolTipComponent {
  private _condition = false;
  _prefix = 'ant-popover-placement';
  _trigger = 'click';
  @Input() nzContent;
  @Input() nzOkText = this._locale.translate('Modal.okText');
  @Input() nzCancelText = this._locale.translate('Modal.cancelText');

  @Input()
  set nzCondition(value: boolean) {
    this._condition = toBoolean(value);
  }

  get nzCondition() {
    return this._condition;
  }

  @Output() nzOnCancel: EventEmitter<any> = new EventEmitter();
  @Output() nzOnConfirm: EventEmitter<any> = new EventEmitter();

  constructor(cdr: ChangeDetectorRef, private _locale: NzLocaleService) {
    super(cdr);
  }

  show(): void {
    if (!this._condition) {
      this.nzVisible = true;
    } else {
      this.onConfirm();
    }
  }

  onCancel() {
    this.nzOnCancel.emit();
    this.nzVisible = false;
  }

  onConfirm() {
    this.nzOnConfirm.emit();
    this.nzVisible = false;
  }
}
