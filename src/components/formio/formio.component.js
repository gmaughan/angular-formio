"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var formiojs_1 = require("formiojs");
var FormioBaseComponent_1 = require("../../FormioBaseComponent");
/* tslint:disable */
var FormioComponent = /** @class */ (function (_super) {
    __extends(FormioComponent, _super);
    function FormioComponent(ngZone, loader, config, customTags) {
        var _this = _super.call(this, ngZone, loader, config, customTags) || this;
        _this.ngZone = ngZone;
        _this.loader = loader;
        _this.config = config;
        _this.customTags = customTags;
        if (_this.config) {
            formiojs_1.Formio.setBaseUrl(_this.config.apiUrl);
            formiojs_1.Formio.setProjectUrl(_this.config.appUrl);
        }
        else {
            console.warn('You must provide an AppConfig within your application!');
        }
        return _this;
    }
    FormioComponent.prototype.getRenderer = function () {
        return this.renderer || formiojs_1.Form;
    };
    FormioComponent = __decorate([
        core_1.Component({
            selector: 'formio',
            templateUrl: './formio.component.html',
            styleUrls: ['./formio.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
        /* tslint:enable */
        ,
        __param(2, core_1.Optional()),
        __param(3, core_1.Optional())
    ], FormioComponent);
    return FormioComponent;
}(FormioBaseComponent_1.FormioBaseComponent));
exports.FormioComponent = FormioComponent;
