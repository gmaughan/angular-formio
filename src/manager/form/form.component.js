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
var FormManagerFormComponent = /** @class */ (function () {
    function FormManagerFormComponent(service, route, appConfig, options, modalService) {
        this.service = service;
        this.route = route;
        this.appConfig = appConfig;
        this.options = options;
        this.modalService = modalService;
        this.choice = 'isUrl';
        this.goTo = '';
    }
    FormManagerFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.formio = new formiojs_1.Formio(_this.appConfig.appUrl + "/form/" + params.id);
            _this.formio.loadForm().then(function (form) {
                _this.projectId = form.project;
                _this.pathName = form.path;
                _this.getShareUrl();
            });
            _this.service.reset(_this.route);
        });
    };
    FormManagerFormComponent.prototype.getShareUrl = function () {
        var src = this.appConfig.appUrl + '/' + this.pathName;
        this.shareUrl = this.options.viewer + "/#/?src=" + encodeURIComponent(src);
        return this.shareUrl;
    };
    FormManagerFormComponent.prototype.openEmbed = function (content) {
        var goto = '';
        if (this.goTo) {
            goto += "if (d && d.formSubmission && d.formSubmission._id) { window.location.href = \"" + this.goTo + "\";}";
        }
        var embedCode = '<script type="text/javascript">';
        embedCode += '(function a(d, w, u) {';
        embedCode += 'var h = d.getElementsByTagName("head")[0];';
        embedCode += 'var s = d.createElement("script");';
        embedCode += 's.type = "text/javascript";';
        embedCode += 's.src = "' + this.options.viewer + '/assets/lib/seamless/seamless.parent.min.js";';
        embedCode += 's.onload = function b() {';
        embedCode += 'var f = d.getElementById("formio-form-' + this.formio.formId + '");';
        embedCode += 'if (!f || (typeof w.seamless === u)) {';
        embedCode += 'return setTimeout(b, 100);';
        embedCode += '}';
        embedCode += 'w.seamless(f, {fallback:false}).receive(function(d, e) {' + goto + '});';
        embedCode += '};';
        embedCode += 'h.appendChild(s);';
        embedCode += '})(document, window);';
        embedCode += '</script>';
        embedCode += '<iframe id="formio-form-' + this.formio.formId + '" ';
        embedCode += 'style="width:100%;border:none;" height="800px" src="' + this.shareUrl + '&iframe=1"></iframe>';
        this.embedCode = embedCode;
        this.modalRef = this.modalService.show(content, { class: 'modal-lg' });
    };
    FormManagerFormComponent.prototype.choices = function (string) {
        this.choice = string;
    };
    FormManagerFormComponent = __decorate([
        core_1.Component({
            templateUrl: './form.component.html'
        })
    ], FormManagerFormComponent);
    return FormManagerFormComponent;
}());
exports.FormManagerFormComponent = FormManagerFormComponent;
