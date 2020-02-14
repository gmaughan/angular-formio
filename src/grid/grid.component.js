"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var lodash_1 = require("lodash");
var formiojs_1 = require("formiojs");
var index_1 = require("./form/index");
var index_2 = require("./submission/index");
var FormioGridComponent = /** @class */ (function () {
    function FormioGridComponent(loader, alerts, resolver, ref) {
        this.loader = loader;
        this.alerts = alerts;
        this.resolver = resolver;
        this.ref = ref;
        this.page = 0;
        this.isLoading = false;
        this.initialized = false;
        this.select = this.rowSelect = new core_1.EventEmitter();
        this.rowAction = new core_1.EventEmitter();
        this.createItem = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.loader.setLoading(true);
    }
    FormioGridComponent.prototype.createComponent = function (property, component) {
        var factory = this.resolver.resolveComponentFactory(component);
        var componentRef = property.createComponent(factory);
        return componentRef.instance;
    };
    FormioGridComponent.prototype.loadGrid = function (src) {
        var _this = this;
        // If no source is provided, then skip.
        if (!src && !this.formio) {
            return;
        }
        // Do not double load.
        if (this.formio && this.src && (src === this.src)) {
            return;
        }
        if (src) {
            this.src = src;
            this.formio = new formiojs_1.Formio(this.src, { formOnly: true });
        }
        // Load the header.
        this.header.load(this.formio)
            .then(function () { return _this.setPage(0); })
            .catch(function (error) { return _this.onError(error); });
    };
    FormioGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Create our components.
        var comps = this.components || ((this.gridType === 'form') ? index_1.default : index_2.default);
        this.header = this.createComponent(this.headerElement, comps.header);
        this.header.actionAllowed = this.actionAllowed.bind(this);
        this.header.sort.subscribe(function (header) { return _this.sortColumn(header); });
        this.body = this.createComponent(this.bodyElement, comps.body);
        this.body.header = this.header;
        this.body.actionAllowed = this.actionAllowed.bind(this);
        this.body.rowSelect.subscribe(function (row) { return _this.rowSelect.emit(row); });
        this.body.rowAction.subscribe(function (action) { return _this.rowAction.emit(action); });
        this.footer = this.createComponent(this.footerElement, comps.footer);
        this.footer.header = this.header;
        this.footer.body = this.body;
        this.footer.actionAllowed = this.actionAllowed.bind(this);
        this.footer.createText = this.createText;
        this.footer.size = this.size;
        this.footer.pageChanged.subscribe(function (page) { return _this.pageChanged(page); });
        this.footer.createItem.subscribe(function (item) { return _this.createItem.emit(item); });
    };
    FormioGridComponent.prototype.ngOnChanges = function (changes) {
        if (this.initialized) {
            if ((changes.src && changes.src.currentValue) ||
                (changes.formio && changes.formio.currentValue)) {
                this.loadGrid(changes.src.currentValue);
            }
            if (changes.items && changes.items.currentValue) {
                this.refreshGrid();
            }
        }
        if (this.footer &&
            (changes.createText && changes.createText.currentValue)) {
            this.footer.createText = changes.createText.currentValue;
        }
    };
    FormioGridComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.alerts.setAlerts([]);
        this.query = this.query || {};
        if (this.refresh) {
            this.refresh.subscribe(function (query) { return _this.refreshGrid(query); });
        }
        this.loadGrid(this.src);
        this.initialized = true;
        this.ref.detectChanges();
    };
    Object.defineProperty(FormioGridComponent.prototype, "loading", {
        set: function (_loading) {
            this.isLoading = _loading;
            this.loader.setLoading(_loading);
        },
        enumerable: true,
        configurable: true
    });
    FormioGridComponent.prototype.actionAllowed = function (action) {
        if (this.isActionAllowed) {
            return this.isActionAllowed(action);
        }
        else {
            return true;
        }
    };
    FormioGridComponent.prototype.onError = function (error) {
        this.loading = false;
        this.error.emit(error);
        this.alerts.setAlert({
            type: 'danger',
            message: error
        });
    };
    FormioGridComponent.prototype.refreshGrid = function (query) {
        var _this = this;
        this.alerts.setAlerts([]);
        this.query = query || this.query;
        if (!this.query.hasOwnProperty('limit')) {
            this.query.limit = 10;
        }
        if (!this.query.hasOwnProperty('skip')) {
            this.query.skip = 0;
        }
        this.loading = true;
        this.ref.detectChanges();
        formiojs_1.Formio.cache = {};
        var loader = null;
        if (this.items) {
            loader = Promise.resolve(this.body.setRows(this.query, this.items));
        }
        else {
            loader = this.body.load(this.formio, this.query);
        }
        loader.then(function (info) {
            _this.loading = false;
            _this.initialized = true;
            _this.ref.detectChanges();
        }).catch(function (error) { return _this.onError(error); });
    };
    FormioGridComponent.prototype.setPage = function (num) {
        if (num === void 0) { num = -1; }
        if (this.isLoading) {
            return;
        }
        this.page = num !== -1 ? num : this.page;
        if (!this.query.hasOwnProperty('limit')) {
            this.query.limit = 10;
        }
        if (!this.query.hasOwnProperty('skip')) {
            this.query.skip = 0;
        }
        this.query.skip = this.page * this.query.limit;
        this.refreshGrid();
    };
    FormioGridComponent.prototype.sortColumn = function (header) {
        // Reset all other column sorts.
        lodash_1.each(this.header.headers, function (col) {
            if (col.key !== header.key) {
                col.sort = '';
            }
        });
        switch (header.sort) {
            case 'asc':
                header.sort = 'desc';
                this.query.sort = '-' + header.key;
                break;
            case 'desc':
                header.sort = '';
                delete this.query.sort;
                break;
            case '':
                header.sort = 'asc';
                this.query.sort = header.key;
                break;
        }
        this.refreshGrid();
    };
    FormioGridComponent.prototype.pageChanged = function (page) {
        this.setPage(page.page - 1);
    };
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "src", void 0);
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "items", void 0);
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "onForm", void 0);
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "query", void 0);
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "refresh", void 0);
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "gridType", void 0);
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "size", void 0);
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "components", void 0);
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "formio", void 0);
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "createText", void 0);
    __decorate([
        core_1.Input()
    ], FormioGridComponent.prototype, "isActionAllowed", void 0);
    __decorate([
        core_1.Output()
    ], FormioGridComponent.prototype, "select", void 0);
    __decorate([
        core_1.Output()
    ], FormioGridComponent.prototype, "rowSelect", void 0);
    __decorate([
        core_1.Output()
    ], FormioGridComponent.prototype, "rowAction", void 0);
    __decorate([
        core_1.Output()
    ], FormioGridComponent.prototype, "createItem", void 0);
    __decorate([
        core_1.Output()
    ], FormioGridComponent.prototype, "error", void 0);
    __decorate([
        core_1.ViewChild('headerTemplate', { read: core_1.ViewContainerRef, static: true })
    ], FormioGridComponent.prototype, "headerElement", void 0);
    __decorate([
        core_1.ViewChild('bodyTemplate', { read: core_1.ViewContainerRef, static: true })
    ], FormioGridComponent.prototype, "bodyElement", void 0);
    __decorate([
        core_1.ViewChild('footerTemplate', { read: core_1.ViewContainerRef, static: true })
    ], FormioGridComponent.prototype, "footerElement", void 0);
    FormioGridComponent = __decorate([
        core_1.Component({
            selector: 'formio-grid',
            styleUrls: ['./grid.component.scss'],
            templateUrl: './grid.component.html'
        })
    ], FormioGridComponent);
    return FormioGridComponent;
}());
exports.FormioGridComponent = FormioGridComponent;
