Ext.define('Ext.ux.tab.Accordion', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.ux_tab_Accordion',

  requires: [
    'Ext.layout.container.Accordion'
  ],

  layout: 'accordion',
  width: 250,
  bodyPadding: 0,

  cfg: {
    treeType: null
  },

  defaults: {
    bodyPadding: 10
  },

  initComponent: function () {
    var me = this;
    var capitalize = me.cfg.treeType.split('');
    capitalize[0] = capitalize[0].toUpperCase();
    capitalize = capitalize.join('');

    var myTree = Ext.create('Ext.ux.tab.Tree', {
      id: 'my_' + me.cfg.treeType,
      title: 'My ' + capitalize,
      treeType: capitalize.substring(0, capitalize.length - 1),
      allowDD: true
    });
    myTree.loadTree('my_' + me.cfg.treeType);

    var sharedTree = Ext.create('Ext.ux.tab.Tree', {
      id: 'shared_' + me.cfg.treeType,
      title: 'Shared ' + capitalize,
      treeType: capitalize.substring(0, capitalize.length - 1),
      allowDD: true
    });
    sharedTree.loadTree('shared_' + me.cfg.treeType);

    this.items = [myTree, sharedTree];

    this.callParent();
  }//, // initComponent
});