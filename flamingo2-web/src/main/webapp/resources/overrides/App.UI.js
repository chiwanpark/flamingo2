Ext.namespace('App.UI');
/**
 * @class App.UI
 * @singleton
 * @author Cloudine Inc
 * @since 0.1
 */
App.UI = new (function () {

    /**
     * ExtJS Grid의 컬럼을 Auto Size를 적용한다.
     */
    this.autoSize = function (grid) {
        var columns = grid.headerCt.getGridColumns();
        var i;
        for (i = 0; i < columns.length; i++) {
            columns[i].autoSize(i);
        }
    },

    /**
     * ExtJS Grid의 컬럼을 Auto Size를 적용한다.
     */
    this.fit = function (grid) {
        var columns = grid.headerCt.getGridColumns();
        var i;
        for (i = 0; i < columns.length; i++) {
            columns[i].maxWidth = 10000;
            columns[i].autoSize(i);
        }
    },

    /**
     * 컴포넌트를 Selector를 이용하여 lookup한다. 한개의 컴포넌트인 경우에만 사용할 수 있다.
     */
    this.query = function (name) {
        return Ext.ComponentQuery.query(name)[0];
    },

    this.getActiveTabIndex = function (tabPanel) {
        var activeTab = tabPanel.getActiveTab();
        return tabPanel.items.findIndex('id', activeTab.id);
    },

    this.fireButton = function (selector) {
        var button = App.UI.query(selector);
        button.fireHandler();
    },

    this.fireEvent = function (selector, event) {
        var comp = App.UI.query(selector);
        comp.fireEvent(event, comp);
    },

    this.isEmpty = function (selector) {
        var comp = App.UI.query(selector);
        return isBlank(comp.getValue());
    },

    this.getSelected = function (grid) {
        return grid.getView().getSelectionModel().getSelection()[0];
    },

    /**
     * UI 컴포넌트를 비활성화 시킨다.
     */
    this.disable = function (component) {
        if (this.is('String', component)) {
            var comp = this.lookup(component);
            comp.setDisabled(true);
        } else {
            component.setDisabled(true);
        }
    },

    /**
     * UI 컴포넌트를 활성화 시킨다.
     */
    this.enable = function (component) {
        if (this.is('String', component)) {
            var comp = this.lookup(component);
            comp.setDisabled(false);
        } else {
            component.setDisabled(false);
        }
    },

    /**
     * 자료형을 검사한다.
     */
    this.is = function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    },

    /**
     * 로그 메시지를 남긴다.
     */
    this.log = function (prefix, output) {
        if (typeof console === "object" && console.log) {
            if (typeof output !== "undefined") {
                console.log('[' + prefix + '] ' + output);
            } else {
                console.log(prefix);
            }
        }
    },

    /**
     * 도움말 창을 생성한다.
     */
    this.newHelp = function (title, height, width, url) {
        return Ext.create('Ext.Window', {
            title: title ? title : 'Help',
            width: height ? height : 850,
            height: width ? width : 600,
            closable: true,
            modal: false,
            closeAction: 'close',
            resizable: true,
            padding: '5 5 5 5',
            layout: 'fit',
            url: url,
            listeners: {
                beforerender: function () {
                    this.add(new Ext.Panel({
                        html: '<iframe style="overflow:auto;width:100%;height:100%;" frameborder="0"  src="' + this.url + '"></iframe>',
                        border: false,
                        autoScroll: true
                    }));
                }
            }

        });
    },

    /**
     * 팝업창을 생성한다.
     */
    this.msg = function (title, format) {
        var msgCt = Ext.core.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        var t = '<div class="msg"><h3>' + title + '</h3><p>' + s + '</p></div>'
        var m = Ext.core.DomHelper.append(msgCt, t, true);
        m.hide();
        m.slideIn('t').ghost("t", {delay: 6000, remove: true});
    },

    /**
     * 팝업창을 생성한다.
     */
    this.msgPopup = function (title, format) {
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));

        Ext.toast({
            title: title,
            html: s,
            align: 't',
            iconCls: 'fa fa-check-circle fa-lg',
            slideInDuration: 500,
            minWidth: 150,
            align: 'br'
        });

        App.UI.notification(format);
    },


    /**
     * 팝업창을 생성한다.
     */
    this.infomsg = function (title, format) {
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));

        Ext.toast({
            title: title,
            html: s,
            align: 't',
            iconCls: 'fa fa-info-circle fa-lg',
            slideInDuration: 500,
            minWidth: 150,
            align: 'br'
        });
    },

    /**
     * 팝업창을 생성한다.
     */
    this.errormsg = function (title, format) {
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));

        Ext.toast({
            title: title,
            html: s,
            align: 't',
            iconCls: 'fa fa-exclamation-circle fa-lg',
            slideInDuration: 500,
            minWidth: 150,
            align: 'br'
        });
    },

    this.notification = function (msg) {
        var c = Ext.getCmp('grdNotification');

        if (c == undefined) {
            return;
        }

        c.getStore().insert(0, {time: Ext.util.Format.date(new Date(), 'G:H:i'), msg: msg});
    },


    this.getTabItem = function (d, c) {
        var b = d.tabBar.items.indexOf(c);
        return d.getComponent(b)
    },
    this.getTabIndex = function (c, b) {
        return c.tabBar.items.indexOf(b)
    },
    this.updateNode = function (b) {
        var c = b.getSelectionModel().getLastSelected();
        var d = b.getStore().getNodeById(c.data.id);
        b.getStore().load({node: d})
    },

    this.updateParentNode = function (b) {
        var d = b.getSelectionModel().getLastSelected();
        var c = d.parentNode;
        var e = b.getStore().getNodeById(c.data.id);
        b.getStore().load({node: e})
    },
    this.updateSelectedNode = function (b, c) {
        var d = b.getStore().getNodeById(c.data.id);
        b.getStore().load({node: d})
    }
});