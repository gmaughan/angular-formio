"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var grid_component_1 = require("../../grid/grid.component");
var FormManagerIndexComponent = /** @class */ (function () {
    function FormManagerIndexComponent(service, route, router, config) {
        this.service = service;
        this.route = route;
        this.router = router;
        this.config = config;
        this.search = '';
        this.gridQuery = { tags: this.config.tag, type: 'form' };
        this.refreshGrid = new core_1.EventEmitter();
    }
    FormManagerIndexComponent.prototype.loadGrid = function () {
        this.search = localStorage.getItem('searchInput');
        this.gridQuery = JSON.parse(localStorage.getItem('query')) || this.gridQuery;
        var currentPage = +localStorage.getItem('currentPage') || 1;
        this.formGrid.refreshGrid(this.gridQuery);
        this.formGrid.setPage(currentPage);
    };
    FormManagerIndexComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.gridQuery = { tags: this.config.tag, type: 'form' };
        this.service.reset();
        this.service.ready.then(function () {
            _this.loadGrid();
            _this.formGrid.footer.pageChanged.subscribe(function (page) {
                localStorage.setItem('currentPage', page.page);
            });
        });
    };
    FormManagerIndexComponent.prototype.onSearch = function () {
        var searchInput = this.search;
        if (searchInput.length > 0) {
            this.gridQuery.skip = 0;
            this.gridQuery.title__regex = '/' + searchInput + '/i';
        }
        else {
            delete this.gridQuery.title__regex;
        }
        localStorage.setItem('query', JSON.stringify(this.gridQuery));
        localStorage.setItem('searchInput', this.search);
        this.formGrid.pageChanged({ page: 1, itemPerPage: this.gridQuery.limit });
        this.refreshGrid.emit(this.gridQuery);
    };
    FormManagerIndexComponent.prototype.clearSearch = function () {
        this.gridQuery = { tags: this.config.tag, type: 'form' };
        localStorage.removeItem('query');
        localStorage.removeItem('searchInput');
        localStorage.removeItem('currentPage');
        this.search = '';
        this.formGrid.pageChanged({ page: 1 });
        this.formGrid.query = {};
        this.formGrid.refreshGrid({ tags: this.config.tag, type: 'form' });
    };
    FormManagerIndexComponent.prototype.onAction = function (action) {
        this.router.navigate([action.row._id, action.action], { relativeTo: this.route });
    };
    FormManagerIndexComponent.prototype.onSelect = function (row) {
        this.router.navigate([row._id, 'view'], { relativeTo: this.route });
    };
    FormManagerIndexComponent.prototype.onCreateItem = function () {
        this.router.navigate(['create'], { relativeTo: this.route });
    };
    __decorate([
        core_1.ViewChild(grid_component_1.FormioGridComponent, { static: false })
    ], FormManagerIndexComponent.prototype, "formGrid", void 0);
    FormManagerIndexComponent = __decorate([
        core_1.Component({
            templateUrl: './index.component.html',
            styleUrls: ['./index.component.scss']
        })
    ], FormManagerIndexComponent);
    return FormManagerIndexComponent;
}());
exports.FormManagerIndexComponent = FormManagerIndexComponent;
