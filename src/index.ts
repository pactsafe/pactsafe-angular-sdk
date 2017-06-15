import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PSClickWrapComponent } from './ps-click-wrap.component';
import { PSBrowseWrapComponent } from './ps-browse-wrap.component';

export * from './ps-click-wrap.component';
export * from './ps-browse-wrap.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PSClickWrapComponent,
    PSBrowseWrapComponent
  ],
  exports: [
    PSClickWrapComponent,
    PSBrowseWrapComponent
  ]
})
export class PSModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PSModule,
      providers: []
    };
  }
}
