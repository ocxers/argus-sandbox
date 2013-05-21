Ext.define('Ext.ux.tab.Container', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.ux_tab_Container',
  
  //AS: i keep all my custom config options in thie object for organization and finding them again easily
  cfg: {
    treeId: null,
    panelId: null
  },
  
  title: 'Home',
  layout: 'border',
  overflow: 'hide',

  initComponent: function () {
    var me = this;

    var tree = Ext.create('Ext.ux.tab.Tree');
    
    //AS: here the cfg object is already available
    tree.id = this.cfg.treeId;
    //tree.loadTree('reports');

    var pan = Ext.create('Ext.ux.tab.panel.Container');
    pan.id = panelId;
    //pan.html = 'Hello Reports';

    me.items = [
      tree,
      pan
    ]

    this.tree = tree;
    this.panel = pan;

    this.callParent();
  },
  setCenter: function (html) {
    this.panel.html = html;
  },
  loadTree: function (flag) {
    this.tree.loadTree(flag);
  },
  setTreeTitle: function (treeTitle) {
    this.tree.title = treeTitle;
  }
});


/*

//AS: normally you can just create the object as an xtype with config options:

this.items = [{
	xtype: 'tabpanel',
	activeTab: 0,
	items: [{
		xtype: 'ux_tab_Container',
		title: 'Dashboards',
		cfg: {
			treeId: 'dashboards_tree',
			panelId: 'dashboards_panel'
		}
	}]
}];

*/