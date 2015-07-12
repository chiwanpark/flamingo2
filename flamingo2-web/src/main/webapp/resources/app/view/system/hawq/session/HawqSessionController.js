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
/**
 * ViewController for Flamingo2.view.system.hawq.session.HawqSession
 *
 * @author Ha Neul, Kim
 * @since 2.0
 * @see Flamingo2.view.system.hawq.session.HawqSession
 */
Ext.define('Flamingo2.view.system.hawq.session.HawqSessionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.hawqSessionController',

    hawqSessionAfterrender: function (panel) {
        this.getReferences().hawqSessionGrid.getStore().reload();
    },

    hawqCurrentqueryRenderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        metaData.tdAttr = 'data-qtip="' + value + '"';
        return value;
    },

    sessionGridItemdblclick: function (grid, record, item, index, e, eOpts) {
        Ext.create('Flamingo2.view.system.hawq.session._SessionDetailWindow', {
            detail: record.getData()
        }).center().show();
    },

    hawqSessionDetailWindowAfterrender: function (window) {
        window.down('form').getForm().setValues(window.detail);
    },

    cancelButtonHandler: function (button) {
        button.up('window').close();
    },

    sessionKillActioncolumnHandler: function (grid, rowIndex, colIndex, item, e, record, row) {
        Ext.MessageBox.show({
            title: message.msg('hawq.title.stop'),
            message: message.msg('hawq.msg.question.stopquery'),
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (buttonId) {
                if (buttonId === 'yes') {
                    invokePostByMap(
                        CONSTANTS.HAWQ.EDITOR.KILL_SESSION,
                        {
                            clusterName: ENGINE.id,
                            pid: record.get('procpid')
                        },
                        function (response) {
                            var result = Ext.decode(response.responseText);
                            if (result.success) {
                                var killSuccess = result.object;
                                Ext.MessageBox.show({
                                    title: killSuccess ? message.msg('hawq.title.success') : message.msg('hawq.title.fail'),
                                    message: killSuccess ? message.msg('hawq.msg.success.stopquery') : message.msg('hawq.msg.fail.notrunning'),
                                    buttons: Ext.MessageBox.OK,
                                    icon: killSuccess ? Ext.MessageBox.INFO : Ext.MessageBox.WARNING,
                                    fn: function () {
                                        setTimeout(function () {
                                            grid.getStore().reload();
                                        }, 1000);
                                    }
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title: message.msg('hawq.title.fail'),
                                    message: message.msg('hawq.msg.fail.stopquery') + '<br/>' + format(message.msg('hawq.msg.cause'), result.error.message),
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING,
                                    fn: function () {
                                        setTimeout(function () {
                                            grid.getStore().reload();
                                        }, 1000);
                                    }
                                });
                            }
                        },
                        function (response) {
                            Ext.MessageBox.show({
                                title: message.msg('hawq.title.fail'),
                                message: format(message.msg('hawq.msg.fail.servererror'), config['system.admin.email']),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                    );
                }
            }
        });
    }
});