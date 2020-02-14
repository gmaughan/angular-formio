"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FormioResourceComponent = /** @class */ (function () {
    function FormioResourceComponent(service, route, auth, changeDetectorRef) {
        this.service = service;
        this.route = route;
        this.auth = auth;
        this.changeDetectorRef = changeDetectorRef;
        this.perms = { delete: false, edit: false };
    }
    FormioResourceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.loadResource(this.route);
        this.service.formLoaded.then(function (form) {
            _this.auth.ready.then(function () {
                _this.service.resourceLoaded.then(function (resource) {
                    _this.service.formFormio.userPermissions(_this.auth.user, form, resource).then(function (perms) {
                        _this.perms.delete = perms.delete;
                        _this.perms.edit = perms.edit;
                        _this.changeDetectorRef.detectChanges();
                    });
                });
            });
        });
    };
    FormioResourceComponent = __decorate([
        core_1.Component({
            templateUrl: './resource.component.html'
        })
    ], FormioResourceComponent);
    return FormioResourceComponent;
}());
exports.FormioResourceComponent = FormioResourceComponent;
