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
var each_1 = require("lodash/each");
var intersection_1 = require("lodash/intersection");
var FormManagerService = /** @class */ (function () {
    function FormManagerService(appConfig, config, auth) {
        var _this = this;
        this.appConfig = appConfig;
        this.config = config;
        this.auth = auth;
        this.form = null;
        this.perms = { delete: false, edit: false };
        if (this.appConfig && this.appConfig.appUrl) {
            formiojs_1.Formio.setBaseUrl(this.appConfig.apiUrl);
            formiojs_1.Formio.setProjectUrl(this.appConfig.appUrl);
        }
        else {
            console.error('You must provide an AppConfig within your application!');
        }
        this.allAccessMap = {
            'update_all': 'formEdit',
            'delete_all': 'formDelete'
        };
        this.ownAccessMap = {
            'update_own': 'formEdit',
            'delete_own': 'formDelete'
        };
        this.actionAllowed = function (action) { return _this.isActionAllowed(action); };
        this.reset();
    }
    FormManagerService.prototype.isActionAllowed = function (action) {
        return this.access[action];
    };
    FormManagerService.prototype.setAccess = function () {
        var _this = this;
        this.access = {
            formCreate: true,
            formView: true,
            formEdit: true,
            formDelete: true,
            submissionIndex: true
        };
        if (this.auth) {
            this.access = {
                formCreate: false,
                formView: false,
                formEdit: false,
                formDelete: false,
                submissionIndex: false
            };
            this.ready = this.auth.ready.then(function () {
                var adminRoles = [];
                each_1.default(_this.auth.roles, function (role, name) {
                    if (role.admin) {
                        adminRoles.push(role._id);
                    }
                });
                if (_this.auth.user && _this.auth.user.roles) {
                    _this.auth.user.roles.forEach(function (roleId) {
                        if (adminRoles.indexOf(roleId) !== -1) {
                            _this.access.formCreate = true;
                            _this.access.formView = true;
                            _this.access.formEdit = true;
                            _this.access.formDelete = true;
                            _this.access.submissionIndex = true;
                        }
                        if (!_this.access.formCreate) {
                            _this.access.formCreate = (_this.auth.formAccess.create_all.indexOf(roleId) !== -1);
                        }
                        if (!_this.access.formView) {
                            _this.access.formView = (_this.auth.formAccess.read_all.indexOf(roleId) !== -1);
                        }
                        if (!_this.access.formEdit) {
                            _this.access.formEdit = (_this.auth.formAccess.update_all.indexOf(roleId) !== -1);
                        }
                        if (!_this.access.formDelete) {
                            _this.access.formDelete = (_this.auth.formAccess.delete_all.indexOf(roleId) !== -1);
                        }
                        if (!_this.access.submissionIndex) {
                            _this.access.submissionIndex = (_this.auth.formAccess.read_all.indexOf(roleId) !== -1);
                        }
                    });
                }
            });
        }
        else {
            this.ready = Promise.resolve(false);
        }
    };
    FormManagerService.prototype.reset = function (route) {
        var _this = this;
        if (route) {
            route.params.subscribe(function (params) {
                if (params.id) {
                    _this.formio = new formiojs_1.Formio(_this.formio.formsUrl + "/" + params.id);
                }
                else {
                    _this.reset();
                }
            });
        }
        else {
            this.formio = new formiojs_1.Formio(this.appConfig.appUrl);
            this.setAccess();
        }
    };
    FormManagerService.prototype.hasAccess = function (roles) {
        if (!this.auth.user) {
            return false;
        }
        return !!intersection_1.default(roles, this.auth.user.roles).length;
    };
    FormManagerService.prototype.setForm = function (form) {
        var _this = this;
        this.form = form;
        if (form.access) {
            // Check if they have access here.
            form.access.forEach(function (access) {
                // Check for all access.
                if (_this.allAccessMap[access.type] && !_this.access[_this.allAccessMap[access.type]]) {
                    _this.access[_this.allAccessMap[access.type]] = _this.hasAccess(access.roles);
                }
                // Check for own access.
                if (_this.auth && _this.auth.user &&
                    (form._id === _this.auth.user._id) &&
                    _this.ownAccessMap[access.type] &&
                    !_this.access[_this.ownAccessMap[access.type]]) {
                    _this.access[_this.ownAccessMap[access.type]] = _this.hasAccess(access.roles);
                }
            });
        }
        return form;
    };
    FormManagerService.prototype.loadForm = function () {
        var _this = this;
        return this.formio.loadForm().then(function (form) { return _this.setForm(form); });
    };
    FormManagerService.prototype.setSubmission = function (route) {
        var _this = this;
        return new Promise(function (resolve) {
            route.params.subscribe(function (params) {
                _this.formio = new formiojs_1.Formio(_this.formio.submissionsUrl + "/" + params.id);
                resolve(_this.formio);
            });
        });
    };
    FormManagerService.prototype.submissionLoaded = function (submission) {
        var _this = this;
        this.auth.ready.then(function () {
            _this.formio.userPermissions(_this.auth.user, _this.form, submission).then(function (perms) {
                _this.perms.delete = perms.delete;
                _this.perms.edit = perms.edit;
            });
        });
    };
    FormManagerService.prototype.loadForms = function () {
        return this.formio.loadForms({ params: {
                tags: this.config.tag
            } });
    };
    FormManagerService.prototype.createForm = function (form) {
        return this.formio.createform(form);
    };
    FormManagerService = __decorate([
        core_1.Injectable()
    ], FormManagerService);
    return FormManagerService;
}());
exports.FormManagerService = FormManagerService;
