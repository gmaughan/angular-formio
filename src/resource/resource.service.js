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
var formio_alerts_1 = require("../components/alerts/formio.alerts");
var native_promise_only_1 = require("native-promise-only");
var formiojs_1 = require("formiojs");
var lodash_1 = require("lodash");
var FormioResourceService = /** @class */ (function () {
    function FormioResourceService(appConfig, config, loader, resourcesService) {
        var _this = this;
        this.appConfig = appConfig;
        this.config = config;
        this.loader = loader;
        this.resourcesService = resourcesService;
        this.initialized = false;
        this.alerts = new formio_alerts_1.FormioAlerts();
        this.refresh = new core_1.EventEmitter();
        this.formLoaded = new native_promise_only_1.default(function (resolve, reject) {
            _this.formResolve = resolve;
            _this.formReject = reject;
        });
        this.init();
    }
    FormioResourceService.prototype.initialize = function () {
        console.warn('FormioResourceService.initialize() has been deprecated.');
    };
    FormioResourceService.prototype.init = function () {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        if (this.appConfig && this.appConfig.appUrl) {
            formiojs_1.Formio.setBaseUrl(this.appConfig.apiUrl);
            formiojs_1.Formio.setProjectUrl(this.appConfig.appUrl);
            formiojs_1.Formio.formOnly = this.appConfig.formOnly;
        }
        else {
            console.error('You must provide an AppConfig within your application!');
        }
        // Create the form url and load the resources.
        this.formUrl = this.appConfig.appUrl + '/' + this.config.form;
        this.resource = { data: {} };
        // Add this resource service to the list of all resources in context.
        if (this.resourcesService) {
            this.resources = this.resourcesService.resources;
            this.resources[this.config.name] = this;
        }
        return this.loadForm();
    };
    FormioResourceService.prototype.onError = function (error) {
        this.alerts.setAlert({
            type: 'danger',
            message: error.message || error
        });
        if (this.resourcesService) {
            this.resourcesService.error.emit(error);
        }
        throw error;
    };
    FormioResourceService.prototype.onFormError = function (err) {
        this.formReject(err);
        this.onError(err);
    };
    FormioResourceService.prototype.setContext = function (route) {
        this.resourceId = route.snapshot.params['id'];
        this.resource = { data: {} };
        this.resourceUrl = this.appConfig.appUrl + '/' + this.config.form;
        if (this.resourceId) {
            this.resourceUrl += '/submission/' + this.resourceId;
        }
        this.formio = new formiojs_1.Formio(this.resourceUrl);
        if (this.resourcesService) {
            this.resources[this.config.name] = this;
        }
        this.loadParents();
    };
    FormioResourceService.prototype.loadForm = function () {
        var _this = this;
        this.formFormio = new formiojs_1.Formio(this.formUrl);
        this.loader.setLoading(true);
        this.formLoading = this.formFormio
            .loadForm()
            .then(function (form) {
            _this.form = form;
            _this.formResolve(form);
            _this.loader.setLoading(false);
            _this.loadParents();
            return form;
        }, function (err) { return _this.onFormError(err); })
            .catch(function (err) { return _this.onFormError(err); });
        return this.formLoading;
    };
    FormioResourceService.prototype.loadParents = function () {
        var _this = this;
        if (!this.config.parents || !this.config.parents.length) {
            return native_promise_only_1.default.resolve([]);
        }
        if (!this.resourcesService) {
            console.warn('You must provide the FormioResources within your application to use nested resources.');
            return native_promise_only_1.default.resolve([]);
        }
        return this.formLoading.then(function (form) {
            // Iterate through the list of parents.
            var _parentsLoaded = [];
            _this.config.parents.forEach(function (parent) {
                var resourceName = parent.resource || parent;
                var resourceField = parent.field || parent;
                var filterResource = parent.hasOwnProperty('filter') ? parent.filter : true;
                if (_this.resources.hasOwnProperty(resourceName) && _this.resources[resourceName].resourceLoaded) {
                    _parentsLoaded.push(_this.resources[resourceName].resourceLoaded.then(function (resource) {
                        var parentPath = '';
                        formiojs_1.Utils.eachComponent(form.components, function (component, path) {
                            if (component.key === resourceField) {
                                component.hidden = true;
                                component.clearOnHide = false;
                                lodash_1.default.set(_this.resource.data, path, resource);
                                parentPath = path;
                                return true;
                            }
                        });
                        return {
                            name: parentPath,
                            filter: filterResource,
                            resource: resource
                        };
                    }));
                }
            });
            // When all the parents have loaded, emit that to the onParents emitter.
            return native_promise_only_1.default.all(_parentsLoaded).then(function (parents) {
                _this.refresh.emit({
                    form: form,
                    submission: _this.resource
                });
                return parents;
            });
        });
    };
    FormioResourceService.prototype.onSubmissionError = function (err) {
        this.onError(err);
    };
    FormioResourceService.prototype.loadResource = function (route) {
        var _this = this;
        this.setContext(route);
        this.loader.setLoading(true);
        this.resourceLoading = this.resourceLoaded = this.formio
            .loadSubmission(null, { ignoreCache: true })
            .then(function (resource) {
            _this.resource = resource;
            _this.loader.setLoading(false);
            _this.refresh.emit({
                property: 'submission',
                value: _this.resource
            });
            return resource;
        }, function (err) { return _this.onSubmissionError(err); })
            .catch(function (err) { return _this.onSubmissionError(err); });
        return this.resourceLoading;
    };
    FormioResourceService.prototype.save = function (resource) {
        var _this = this;
        var formio = resource._id ? this.formio : this.formFormio;
        return formio
            .saveSubmission(resource)
            .then(function (saved) {
            _this.resource = saved;
            return saved;
        }, function (err) { return _this.onError(err); })
            .catch(function (err) { return _this.onError(err); });
    };
    FormioResourceService.prototype.remove = function () {
        var _this = this;
        return this.formio
            .deleteSubmission()
            .then(function () {
            _this.resource = null;
        }, function (err) { return _this.onError(err); })
            .catch(function (err) { return _this.onError(err); });
    };
    FormioResourceService = __decorate([
        core_1.Injectable(),
        __param(3, core_1.Optional())
    ], FormioResourceService);
    return FormioResourceService;
}());
exports.FormioResourceService = FormioResourceService;
