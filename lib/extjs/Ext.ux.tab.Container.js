Ext.define('Ext.ux.tab.Container', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.ux_tab_Container',

  title: 'Home',
  layout: 'border',
  overflow: 'hide',

  cfg: {
    treeType: null,
    panelType: null
  },

  initComponent: function () {
    var me = this;
    var allowDD = me.cfg.treeType.indexOf('home') < 0;

    var pan = Ext.create('Ext.ux.tab.panel.Container', {
      id: me.cfg.panelType
    });

    if (allowDD) {
      var accordion = Ext.create('Ext.ux.tab.Accordion', {
        cfg: {
          treeType: me.cfg.treeType
        },
        region: 'west',
        split: true
      });

      me.items = [
        accordion,
        pan
      ]
    } else {
      var tree = Ext.create('Ext.ux.tab.Tree', {
        id: me.cfg.treeType + '_tree',
        region: 'west',
        collapsible: true,
        split: true,
        allowDD: allowDD
      });

      me.items = [
        tree,
        pan
      ];

      this.tree = tree;
      tree.loadTree('home');
    }

    this.panel = pan;

    this.callParent();
  },
  setCenter: function (html) {
    this.panel.html = html;
  },
  setTreeTitle: function (treeTitle) {
    //this.tree.title = treeTitle;
  }
});
