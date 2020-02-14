"use strict";
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
var lodash_1 = require("lodash");
/* tslint:disable */
var FormBuilderComponent = /** @class */ (function () {
    function FormBuilderComponent(ngZone, config, customTags) {
        var _this = this;
        this.ngZone = ngZone;
        this.config = config;
        this.customTags = customTags;
        this.componentAdding = false;
        this.noeval = false;
        if (this.config) {
            formiojs_1.Formio.setBaseUrl(this.config.apiUrl);
            formiojs_1.Formio.setProjectUrl(this.config.appUrl);
        }
        else {
            console.warn('You must provide an AppConfig within your application!');
        }
        this.change = new core_1.EventEmitter();
        this.ready = new Promise(function (resolve) {
            _this.readyResolve = resolve;
        });
    }
    FormBuilderComponent.prototype.ngOnInit = function () {
        var _this = this;
        formiojs_1.Utils.Evaluator.noeval = this.noeval;
        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(function () {
                _this.ngZone.runOutsideAngular(function () {
                    _this.buildForm(_this.form);
                });
            });
        }
    };
    FormBuilderComponent.prototype.setInstance = function (instance) {
        var _this = this;
        this.formio = instance;
        instance.off('addComponent');
        instance.off('saveComponent');
        instance.off('updateComponent');
        instance.off('removeComponent');
        instance.on('addComponent', function (component, parent, path, index, isNew) {
            _this.ngZone.run(function () {
                if (isNew) {
                    _this.componentAdding = true;
                }
                else {
                    _this.change.emit({
                        type: 'addComponent',
                        builder: instance,
                        form: instance.schema,
                        component: component,
                        parent: parent,
                        path: path,
                        index: index
                    });
                    _this.componentAdding = false;
                }
            });
        });
        instance.on('saveComponent', function (component, original, parent, path, index, isNew) {
            _this.ngZone.run(function () {
                _this.change.emit({
                    type: _this.componentAdding ? 'addComponent' : 'saveComponent',
                    builder: instance,
                    form: instance.schema,
                    component: component,
                    originalComponent: original,
                    parent: parent,
                    path: path,
                    index: index,
                    isNew: isNew || false
                });
                _this.componentAdding = false;
            });
        });
        instance.on('updateComponent', function (component) {
            _this.ngZone.run(function () {
                _this.change.emit({
                    type: 'updateComponent',
                    builder: instance,
                    form: instance.schema,
                    component: component
                });
            });
        });
        instance.on('removeComponent', function (component, parent, path, index) {
            _this.ngZone.run(function () {
                _this.change.emit({
                    type: 'deleteComponent',
                    builder: instance,
                    form: instance.schema,
                    component: component,
                    parent: parent,
                    path: path,
                    index: index
                });
            });
        });
        this.ngZone.run(function () {
            _this.readyResolve(instance);
        });
        return instance;
    };
    FormBuilderComponent.prototype.setDisplay = function (display) {
        var _this = this;
        return this.builder.setDisplay(display).then(function (instance) { return _this.setInstance(instance); });
    };
    FormBuilderComponent.prototype.buildForm = function (form) {
        var _this = this;
        if (!form || !this.builderElement || !this.builderElement.nativeElement) {
            return;
        }
        if (this.builder) {
            return this.setDisplay(form.display).then(function () {
                _this.builder.form = form;
                _this.builder.instance.form = form;
                return _this.builder.instance;
            });
        }
        var Builder = this.formbuilder || formiojs_1.FormBuilder;
        var extraTags = this.customTags ? this.customTags.tags : [];
        this.builder = new Builder(this.builderElement.nativeElement, form, lodash_1.assign({
            icons: 'fontawesome',
            sanitizeConfig: {
                addTags: extraTags
            }
        }, this.options || {}));
        return this.builder.ready.then(function (instance) { return _this.setInstance(instance); });
    };
    FormBuilderComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        formiojs_1.Utils.Evaluator.noeval = this.noeval;
        if (changes.form && changes.form.currentValue) {
            this.ngZone.runOutsideAngular(function () {
                _this.buildForm(changes.form.currentValue || { components: [] });
            });
        }
    };
    FormBuilderComponent.prototype.ngOnDestroy = function () {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
        if (this.formio) {
            this.formio.destroy();
        }
    };
    __decorate([
        core_1.Input()
    ], FormBuilderComponent.prototype, "form", void 0);
    __decorate([
        core_1.Input()
    ], FormBuilderComponent.prototype, "options", void 0);
    __decorate([
        core_1.Input()
    ], FormBuilderComponent.prototype, "formbuilder", void 0);
    __decorate([
        core_1.Input()
    ], FormBuilderComponent.prototype, "noeval", void 0);
    __decorate([
        core_1.Input()
    ], FormBuilderComponent.prototype, "refresh", void 0);
    __decorate([
        core_1.Output()
    ], FormBuilderComponent.prototype, "change", void 0);
    __decorate([
        core_1.ViewChild('builder', { static: true })
    ], FormBuilderComponent.prototype, "builderElement", void 0);
    FormBuilderComponent = __decorate([
        core_1.Component({
            selector: 'form-builder',
            templateUrl: './formbuilder.component.html',
            styleUrls: ['./formbuilder.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
        /* tslint:enable */
        ,
        __param(1, core_1.Optional()),
        __param(2, core_1.Optional())
    ], FormBuilderComponent);
    return FormBuilderComponent;
}());
exports.FormBuilderComponent = FormBuilderComponent;
