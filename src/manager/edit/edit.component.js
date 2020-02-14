"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var formbuilder_component_1 = require("../../components/formbuilder/formbuilder.component");
var lodash_1 = require("lodash");
var FormManagerEditComponent = /** @class */ (function () {
    function FormManagerEditComponent(service, router, route, config, ref, alerts) {
        this.service = service;
        this.router = router;
        this.route = route;
        this.config = config;
        this.ref = ref;
        this.alerts = alerts;
        this.form = { components: [] };
        this.formReady = false;
        this.loading = false;
        this.editMode = false;
    }
    FormManagerEditComponent.prototype.initBuilder = function (editing) {
        var _this = this;
        if (editing) {
            this.loading = true;
            this.ref.detectChanges();
            this.editMode = true;
            return this.service.loadForm().then(function (form) {
                _this.form = form;
                _this.formTitle.nativeElement.value = form.title;
                _this.formType.nativeElement.value = form.display || 'form';
                _this.loading = false;
                _this.formReady = true;
                _this.ref.detectChanges();
                return true;
            }).catch(function (err) {
                _this.alerts.setAlert({ type: 'danger', message: (err.message || err) });
                _this.loading = false;
                _this.formReady = true;
            });
        }
        else {
            this.formReady = true;
            return Promise.resolve(true);
        }
    };
    FormManagerEditComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.route.url.subscribe(function (url) {
            _this.initBuilder((url[0].path === 'edit'));
        });
    };
    FormManagerEditComponent.prototype.onDisplaySelect = function (event) {
        this.builder.setDisplay(event.target.value);
    };
    FormManagerEditComponent.prototype.saveForm = function () {
        var _this = this;
        this.loading = true;
        this.form.title = this.formTitle.nativeElement.value;
        this.form.display = this.formType.nativeElement.value;
        this.form.components = this.builder.formio.schema.components;
        if (this.config.tag) {
            this.form.tags = this.form.tags || [];
            this.form.tags.push(this.config.tag);
            this.form.tags = lodash_1.default.uniq(this.form.tags);
        }
        if (!this.form._id) {
            this.form.name = lodash_1.default.camelCase(this.form.title).toLowerCase();
            this.form.path = this.form.name;
        }
        return this.service.formio.saveForm(this.form).then(function (form) {
            _this.form = _this.service.setForm(form);
            _this.loading = false;
            return _this.form;
        }).catch(function (err) {
            _this.loading = false;
            // Catch if a form is returned as an error. This is a conflict.
            if (err._id && err.type) {
                throw err;
            }
            _this.alerts.setAlert({ type: 'danger', message: (err.message || err) });
        });
    };
    FormManagerEditComponent.prototype.onSave = function () {
        var _this = this;
        return this.saveForm().then(function (form) {
            if (_this.editMode) {
                _this.router.navigate(['../', 'view'], { relativeTo: _this.route });
            }
            else {
                _this.router.navigate(['../', form._id, 'view'], { relativeTo: _this.route });
            }
        });
    };
    __decorate([
        core_1.ViewChild(formbuilder_component_1.FormBuilderComponent, { static: false })
    ], FormManagerEditComponent.prototype, "builder", void 0);
    __decorate([
        core_1.ViewChild('title', { static: false })
    ], FormManagerEditComponent.prototype, "formTitle", void 0);
    __decorate([
        core_1.ViewChild('type', { static: false })
    ], FormManagerEditComponent.prototype, "formType", void 0);
    FormManagerEditComponent = __decorate([
        core_1.Component({
            templateUrl: './edit.component.html'
        })
    ], FormManagerEditComponent);
    return FormManagerEditComponent;
}());
exports.FormManagerEditComponent = FormManagerEditComponent;
