import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ButtonCloseComponent } from './_shared/components/button-close.component';
import { ButtonMinimizeComponent } from './_shared/components/button-minimize.component';
import { IconComponent } from './_shared/components/icon.component';
import { WindowComponent } from './_shared/components/window.component';
import { DraggableDirective } from './_shared/directives/draggable.directive';
import { LinkifyPipe } from './_shared/pipes/linkify.pipe';

const matImports = [
  MatToolbarModule, MatFormFieldModule, MatButtonModule, MatInputModule,
  MatIconModule, MatMenuModule, MatProgressSpinnerModule, MatChipsModule,
  MatCheckboxModule, MatButtonToggleModule, MatDialogModule, MatStepperModule
];

const declarations = [
  DraggableDirective, ButtonCloseComponent, ButtonMinimizeComponent, IconComponent, WindowComponent, LinkifyPipe
];


@NgModule({
  declarations: [...declarations],
  imports: [CommonModule, ...matImports],
  exports: [...matImports, ...declarations]
})
export class SharedModule { }
