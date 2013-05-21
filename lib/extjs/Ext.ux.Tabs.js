Ext.define('Ext.ux.Tabs', {
  extend: 'Ext.tab.Panel',
  alias: 'widget.ux_Tabs',

  width: 800,
  height: 500,
  frame: true,

  initComponent: function () {
    var me = this;

    var tabs = [];
    tabs[0] = Ext.create('Ext.ux.tab.Container',{
      title: 'Home',
      cfg: {
        treeType: 'home',
        panelType: 'home'
      }
    });
    //tabs[0].loadTree('home');
    //tabs[0].setTreeTitle('Favorites');
    tabs[0].setCenter('==>>Hello Home<<==');

    tabs[1] = Ext.create('Ext.ux.tab.Container', {
      title: 'Reports',
      cfg: {
        treeType: 'reports',
        panelType: 'reports'
      }
    });
    //tabs[1].loadTree('reports');
    //tabs[1].setTreeTitle('My Reports');
    //tabs[1].setCenter('==>>Hello Reports<<==');

    tabs[2] = Ext.create('Ext.ux.tab.Container', {
      title: 'Dashboards',
      cfg: {
        treeType: 'dashboards',
        panelType: 'dashboards'
      }
    });
    //tabs[2].loadTree('dashboards');
    //tabs[2].setTreeTitle('My Dashboards');
    tabs[2].setCenter('==>>Hello Dashboards<<==');

    tabs[3] = Ext.create('Ext.ux.tab.Container', {
      title: 'Slideshows',
      cfg: {
        treeType: 'slideshows',
        panelType: 'slideshows'
      }
    });
    //tabs[3].loadTree('slideshows');
    //tabs[3].setTreeTitle('My Slideshows');
    tabs[3].setCenter('==>>Hello Slideshows<<==');

    me.items = [tabs[0], tabs[1], tabs[2], tabs[3]];

    this.callParent(arguments);

  }//, // initComponent
});
