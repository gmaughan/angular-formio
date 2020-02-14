"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var formiojs_1 = require("formiojs");
var FormManagerViewComponent = /** @class */ (function () {
    function FormManagerViewComponent(service, router, route, config, auth) {
        this.service = service;
        this.router = router;
        this.route = route;
        this.config = config;
        this.auth = auth;
        this.onSuccess = new core_1.EventEmitter();
        this.onError = new core_1.EventEmitter();
        this.renderOptions = {
            saveDraft: this.config.saveDraft
        };
        this.currentForm = null;
        this.submission = { data: {} };
    }
    FormManagerViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Reset the formio service to this form only.
        this.service.formio = new formiojs_1.Formio(this.service.formio.formUrl);
        this.service.loadForm().then(function (form) {
            _this.currentForm = form;
        });
    };
    FormManagerViewComponent.prototype.onSubmit = function (submission) {
        var _this = this;
        this.submission.data = submission.data;
        this.submission.state = 'complete';
        this.service.formio.saveSubmission(this.submission).then(function (saved) {
            _this.onSuccess.emit();
            _this.router.navigate(['../', 'submission', saved._id], { relativeTo: _this.route });
        }).catch(function (err) { return _this.onError.emit(err); });
    };
    FormManagerViewComponent = __decorate([
        core_1.Component({
            templateUrl: './view.component.html'
        })
    ], FormManagerViewComponent);
    return FormManagerViewComponent;
}());
exports.FormManagerViewComponent = FormManagerViewComponent;
