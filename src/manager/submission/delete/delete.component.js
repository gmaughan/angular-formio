"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SubmissionDeleteComponent = /** @class */ (function () {
    function SubmissionDeleteComponent(service, router, route, alerts) {
        this.service = service;
        this.router = router;
        this.route = route;
        this.alerts = alerts;
    }
    SubmissionDeleteComponent.prototype.onDelete = function () {
        var _this = this;
        this.service.formio.deleteSubmission().then(function () {
            _this.router.navigate(['../../'], { relativeTo: _this.route });
        }).catch(function (err) { return _this.alerts.setAlert({ type: 'danger', message: (err.message || err) }); });
    };
    SubmissionDeleteComponent.prototype.onCancel = function () {
        this.router.navigate(['../', 'view'], { relativeTo: this.route });
    };
    SubmissionDeleteComponent = __decorate([
        core_1.Component({
            templateUrl: './delete.component.html'
        })
    ], SubmissionDeleteComponent);
    return SubmissionDeleteComponent;
}());
exports.SubmissionDeleteComponent = SubmissionDeleteComponent;
