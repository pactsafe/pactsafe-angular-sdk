/*****
 * Browse-wrap component
 * Easily plug into your existing angular project to get the functionality of our JavaScript library
 * Consult the readme for a more in-depth description
 *
 * Author: Justin Willoughby
 *         6/14/2017
 */

declare var _ps: any;

import {Component, Input, OnInit, OnDestroy, AfterViewInit} from '@angular/core';

@Component({
  selector: 'ps-browse-wrap',
  template: `<a [href]="link" [id]="targetSelector">{{ linkText }}</a>`,
  styles: [/* Add your own styles here */]
})
export class PSBrowseWrapComponent implements OnInit, OnDestroy, AfterViewInit {
  // ABSOLUTELY REQUIRED
  @Input() accessId: string = null;
  @Input() groupKey: string = null;
  @Input() linkText: string = null;

  // OVERWRITE INPUTS/CAN BE PULLED FROM PS
  @Input() alwaysVisible: boolean = false;
  @Input() badgeText: string = this.linkText;
  @Input() position: string = 'auto';

  // CONDITIONAL INPUTS
  @Input() openLegalCenter: boolean = true;
  @Input() link: string = null;

  targetSelector: string = 'psbw-';
  createOptions: object = {};
  loadOptions: object = {};

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
      })(window, document, 'script', 'https://127.0.0.1:8080/ps.js', '_ps');
    }
  }

  ngOnInit() {
    // Make sure required input has been provided
    if (this.accessId == null) {
      throw new Error('Attribute "accessId" is required');
    } else if (this.groupKey == null) {
      throw new Error('Attribute "groupKey" is required');
    } else if (this.linkText == null) {
      throw new Error('Attribute "linkText" is required');
    }

    this.targetSelector = 'psbw-' + this.groupKey;

    // Validation and assignment for conditional input
    // IF OPENLEGALCENTER == FALSE -> LINK
    if (!this.openLegalCenter && this.link == null) {
      throw new Error('If "openLegalCenter" is false, then "link" is required');
    }

    // Set up the BrowseWrap options based on input
    Object.assign(this.loadOptions, {
      target_selector: this.targetSelector,
      position: this.position,
      badge_text: this.badgeText,
      always_visible: this.alwaysVisible,
      open_legal_center: this.openLegalCenter
    });
  }

  ngAfterViewInit() {
    // With everything initialized, create and load in the BrowseWrap
    _ps('create', this.accessId, this.createOptions);
    _ps('load', this.groupKey, this.loadOptions);
  }

  ngOnDestroy() {
    // Let _ps know that the group is not showing
    _ps.getByKey(this.groupKey).rendered = false;
  }
}
