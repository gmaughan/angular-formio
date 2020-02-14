"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resource_component_1 = require("./resource.component");
var view_component_1 = require("./view/view.component");
var edit_component_1 = require("./edit/edit.component");
var delete_component_1 = require("./delete/delete.component");
var create_component_1 = require("./create/create.component");
var index_component_1 = require("./index/index.component");
function FormioResourceRoutes(config) {
    return [
        {
            path: '',
            component: config && config.index ? config.index : index_component_1.FormioResourceIndexComponent
        },
        {
            path: 'new',
            component: config && config.create ? config.create : create_component_1.FormioResourceCreateComponent
        },
        {
            path: ':id',
            component: config && config.resource ? config.resource : resource_component_1.FormioResourceComponent,
            children: [
                {
                    path: '',
                    redirectTo: 'view',
                    pathMatch: 'full'
                },
                {
                    path: 'view',
                    component: config && config.view ? config.view : view_component_1.FormioResourceViewComponent
                },
                {
                    path: 'edit',
                    component: config && config.edit ? config.edit : edit_component_1.FormioResourceEditComponent
                },
                {
                    path: 'delete',
                    component: config && config.delete ? config.delete : delete_component_1.FormioResourceDeleteComponent
                }
            ]
        }
    ];
}
exports.FormioResourceRoutes = FormioResourceRoutes;
