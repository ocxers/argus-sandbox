Ext.define('Ext.ux.tab.panel.Container', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.ux_tab_panel_Container',

  region: 'center',

  initComponent: function () {
    var me = this;

    this.callParent();
  },
  writeHtml: function (html) {
    this.html = html;
  }
});