"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var elements_1 = require("@angular/elements");
var formiojs_1 = require("formiojs");
var create_custom_component_1 = require("./create-custom-component");
var custom_tags_service_1 = require("./custom-tags.service");
function registerCustomTag(tag, injector) {
    injector.get(custom_tags_service_1.CustomTagsService).addCustomTag(tag);
}
exports.registerCustomTag = registerCustomTag;
function registerCustomTags(tags, injector) {
    tags.forEach(function (tag) { return registerCustomTag(tag, injector); });
}
exports.registerCustomTags = registerCustomTags;
function registerCustomFormioComponent(options, angularComponent, injector) {
    registerCustomTag(options.selector, injector);
    var complexCustomComponent = elements_1.createCustomElement(angularComponent, { injector: injector });
    customElements.define(options.selector, complexCustomComponent);
    formiojs_1.Components.setComponent(options.type, create_custom_component_1.createCustomFormioComponent(options));
}
exports.registerCustomFormioComponent = registerCustomFormioComponent;
function registerCustomFormioComponentWithClass(options, angularComponent, formioClass, injector) {
    registerCustomTag(options.selector, injector);
    var complexCustomComponent = elements_1.createCustomElement(angularComponent, { injector: injector });
    customElements.define(options.selector, complexCustomComponent);
    formiojs_1.Components.setComponent(options.type, formioClass);
}
exports.registerCustomFormioComponentWithClass = registerCustomFormioComponentWithClass;
