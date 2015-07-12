/*
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.define('Flamingo2.view.dashboard.DashboardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.dashboardModel',

    data: {
        title: message.msg('dashboard.workflow_monitoring')
    },

    stores: {
        workflowHistoryStore: {
            autoLoad: false,
            pageSize: 12,
            model: 'Flamingo2.model.dashboard.WorkflowHistory',
            proxy: {
                type: 'ajax',
                url: CONSTANTS.DASHBOARD.GET_WORKFLOW_HISTORY,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total',
                    idProperty: 'id'
                },
                extraParams: {
                    clusterName: '',
                    startDate: '',
                    endDate: '',
                    status: '',
                    workflowName: ''
                }
            }
        }
    }
});