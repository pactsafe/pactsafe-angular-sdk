/*****
 * Click-wrap component
 * Easily plug into your existing angular project to get the functionality of our JavaScript library
 * Consult the readme for a more in-depth description
 *
 * Author: Justin Willoughby
 *         6/14/2017
 */

declare var _ps: any;

import {Component, OnInit, Input, OnDestroy, AfterViewInit} from '@angular/core';

@Component({
  selector: 'ps-click-wrap',
  template: `<div [id]="containerName"></div>`,
  styles: [/* Add your own styles here */]
})
export class PSClickWrapComponent implements OnInit, OnDestroy, AfterViewInit {
  // ABSOLUTELY REQUIRED
  @Input() accessId: string = null;

  // OVERWRITE INPUTS/CAN BE PULLED FROM PS
  @Input() clickWrapStyle: string = 'full';
  @Input() containerName: string = 'ps-clickwrap';
  @Input() displayImmediately: boolean = true;
  @Input() displayAll: boolean = true;
  @Input() forceScroll: boolean = false;
  @Input() confirmationEmail: boolean = false;
  @Input() disableSending: boolean = false;
  @Input() testMode: boolean = false;

  // CONDITIONAL INPUTS
  @Input() groupKey: string = null;
  @Input() filter: string = null;

  @Input() dynamic: boolean = false;
  @Input() renderData: object = null;

  @Input() signerIdSelector: string = null;
  @Input() signerId: string = null;

  createOptions = {};
  loadOptions = {};

  constructor() {
    // Invoke snippet, if it's not already created
    if (window['_ps'] == null || window['_ps'] == undefined) {
      (function (w, d, s, c, n, a, b) {
        w['PactSafeObject'] = n;
        w[n] = w[n] || function () {
            (w[n].q = w[n].q || []).push(arguments);
          }, w[n].on = function () {
          (w[n].e = w[n].e || []).push(arguments);
        }, w[n].once = function () {
          (w[n].eo = w[n].eo || []).push(arguments);
        }, w[n].off = function () {
          (w[n].o = w[n].o || []).push(arguments);
        }, w[n].t = (new Date()).getDate();
        a = d.createElement(s);
        b = d.getElementsByTagName(s)[0];
        a.async = 1;
        a.src = c;
        b.parentNode.insertBefore(a, b);
      })(window, document, 'script', '//vault.pactsafe.io/ps.min.js', '_ps');
    }
  }

  ngOnInit() {
    // Make sure required input has been provided
    if (this.accessId == null) {
      throw new Error('Attribute "accessId" is required');
    }

    // Validation and assignment for conditional input
    // IF GROUPKEY -> NO FILTER : IF FILTER -> NO GROUPKEY
    if ((this.groupKey == null && this.filter == null) || (this.groupKey != null && this.filter != null)) {
      throw new Error('Either "groupKey" or "filter" is required in clickwrap attributes');
    } else {
      if (this.groupKey == null) {
        this.loadOptions['filter'] = this.filter;
      } else {
        this.loadOptions['groupKey'] = this.groupKey;
        this.loadOptions['event_callback'] = (err, group) => {
          try {
            group.render(true);
          } catch (e) {
            throw new Error('Unable to re-render clickwrap');
          }
        };
      }
    }

    // IF DYNAMIC -> RENDER DATA != NULL
    if (this.dynamic && this.renderData == null) {
      throw new Error('If "dynamic" attribute is set, then "renderData" is required');
    }

    // IF SIGNERIDSELECTOR -> NO SIGNERID : IF SIGNER ID -> NO SIGNERIDSELECTOR
    if ((this.signerIdSelector == null && this.signerId == null) || (this.signerIdSelector != null && this.signerId != null)) {
      throw new Error('Either "signerIdSelector" or "signerId" is required in clickwrap attributes');
    } else {
      if (this.signerIdSelector == null) {
        this.createOptions['signer_id'] = this.signerId;
      } else {
        this.loadOptions['signer_id_selector'] = this.signerIdSelector;
      }
    }

    // Set up the ClickWrap options based on input
    Object.assign(this.createOptions, {
      testMode: this.testMode,
      disable_sending: this.disableSending,
      dynamic: this.dynamic
    });
    Object.assign(this.loadOptions, {
      container_selector: this.containerName,
      style: this.clickWrapStyle,
      display_all: this.displayAll,
      render_data: this.renderData,
      auto_run: this.displayImmediately,
      force_scroll: this.forceScroll,
      confirmation_email: this.confirmationEmail
    });
  }

  ngAfterViewInit() {
    // With everything initialized, create and load in the clickwrap
    _ps('create', this.accessId, this.createOptions);
    if (this.groupKey) {
      _ps('load', this.groupKey, this.loadOptions);
    } else {
      _ps('load', this.loadOptions);
    }
  }

  ngOnDestroy() {
    // Let _ps know that the group is not showing
    _ps.getByKey(this.groupKey).rendered = false;
  }
}
