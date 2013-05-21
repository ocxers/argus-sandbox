// Ext.ux.tab.tree.Window
Ext.require([
  'Ext.window.Window'
]);

Ext.define('Ext.ux.tab.tree.Window', {
  extend: 'Ext.Window',
  alias: 'widget.ux_tab_tree_Window',

  cfg: {
    title: null,
    id: null,
    fieldLabel: null
  },

  modal: true,
  width: 300,
  plain: true,
  bodyPadding: 5,
  layout: 'form',
  fieldDefaults: {
    labelWidth: 100,
    anchor: '100%'
  },

  initComponent: function () {
    var me = this;
    Ext.apply(this, {
      items: [
        {
          xtype: 'textfield',
          id: me.cfg.id,
          fieldLabel: me.cfg.fieldLabel,
          name: 'subject'
        }
      ]
    });

    this.callParent();
  }
});

