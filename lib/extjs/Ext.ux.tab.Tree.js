Ext.require([
  'Ext.window.Window'
]);

Ext.define('Ext.ux.tab.Tree', {
  extend: 'Ext.tree.Panel',
  alias: 'widget.ux_tab_Tree',

  requires: [
    'Ext.tree.*'
  ],
  xtype: 'treepanel',
  title: 'Favorites',
  width: 250,
  layout: 'fit',
  rootVisible: false,
  border: false,

  treeType: null,

  allowDD: null,

  initComponent: function () {
    var me = this;
    if (me.allowDD) {
      Ext.apply(this, {
        bbar: [
          '->', { xtype: 'splitbutton', glyph: 72, text: 'Options', menu: [
            {
              id: me.id + '_createFolder',
              text: 'Create Folder'
            },
            {
              id: me.id + '_editFolder',
              hidden: true,
              text: 'Edit Folder',
              listeners: {
                click: function () {
                  var win= Ext.create('Ext.Window', {
                    title: 'Edit Folder',
                    xtype: 'form',
                    layout: 'form',
                    width: 400,
                    height: 200,
                    modal: true,
                    plain: true,
                    buttons: [{
                      text: 'Save',
                      handler: function() {
                        this.up('form').getForm().isValid();
                      }
                    },{
                      text: 'Cancel',
                      handler: function() {
                        win.hide();
                      }
                    }],
                    items: []
                  });

                  win.show();

                  console.log('You jsut click "Edit Folder"');
                }
              }
            },
            {
              id: me.id + '_deleteFolder',
              hidden: true,
              text: 'Delete Folder',
              listeners: {
                click: function () {
                  console.log('You jsut click "Edit Folder"');
                }
              }
            },
            {
              id: me.id + '_create',
              hidden: true,
              text: 'Create ' + me.treeType
            },
            {
              id: me.id + '_edit',
              hidden: true,
              text: 'Edit ' + me.treeType,
              listeners: {
                click: function () {
                  console.log('You jsut click "Edit Report"');
                }
              }
            },
            {
              id: me.id + '_delete',
              hidden: true,
              text: 'Delete ' + me.treeType,
              listeners: {
                click: function () {
                  console.log('You jsut click "Delete Report"');
                }
              }
            }
          ] }
        ],
        viewConfig: {
          plugins: {
            ptype: 'treeviewdragdrop',
            appendOnly: true,
            pluginId: 'treeviewdragdrop',
            containerScroll: true
          },
          listeners: {
            beforedrop: function (node, data, overModel) {
              var isLeaf = data.records[0].data.leaf;
              if (!isLeaf) {
                return false;
              }
            },
            drop: function (node, data, overModel, dropPosition) {
              //console.log('getRootNode');
              //console.log(data);
              //this.saveTask = new Ext.util.DelayedTask(this.saveData, this);
              //this.saveTask.delay(2500);

              console.log(Ext.encode(getTreeData(me.getRootNode())));
              /*
               argo.post('Reporting:Reporting:saveReports', {
               folders: getTreeData(me.getRootNode())
               }, function (success, result) {
               if (!success) return;
               console.log(result);
               });
               */
            }
          }
        },
        listeners: {
          scope: this,
          selectionChange: function (tree, records) {
            var node = records[0];
            if (node.data.leaf) {
              // console.log('I\'m a leaf!');
              this.down('#' + this.id + '_create').hide();
              this.down('#' + this.id + '_editFolder').hide();
              this.down('#' + this.id + '_deleteFolder').hide();

              this.down('#' + this.id + '_edit').show();
              this.down('#' + this.id + '_delete').show();
            } else {
              // console.log('I\'m not a leaf!');
              this.down('#' + this.id + '_create').show();
              this.down('#' + this.id + '_editFolder').show();
              this.down('#' + this.id + '_deleteFolder').show();

              this.down('#' + this.id + '_edit').hide();
              this.down('#' + this.id + '_delete').hide();

            }
          }
        }
      });
    }
    else {
      Ext.apply(this, {
        listeners: {
          scope: this,
          selectionChange: function (tree, records) {
            var node = records[0];
            if (node.data.leaf) {
              console.log(node.data);
              //Ext.getCmp('home').setTitle(node.data.text);
              //console.log(Ext.getCmp('home'));

              // console.log('I\'m a leaf!');
            } else {
              // console.log('I\'m not a leaf!');
            }
          }
        }
      });
    }

    this.callParent();
  },

  // loadTree by flag: home,reports,dashboards,slideshows
  loadTree: function (flag) {
    this.getRootNode().removeAll();
    var rootNode = this.getRootNode();

    if (flag.indexOf('reports') > -1) {
      argo.post('Reporting:Reporting:loadReports', {}, function (success, result) {
        if (!success) return;
        console.log(result);

        appendSubNodes(result, rootNode);
      });
    } else if (flag.indexOf('dashboards') > -1) {
      argo.post('Reporting:Reporting:loadDashboards', {}, function (success, result) {
        if (!success) return;

        appendSubNodes(result, rootNode);
      });
    } else if (flag.indexOf('slideshows') > -1) {
      argo.post('Reporting:Reporting:loadSlideshows', {}, function (success, result) {
        if (!success) return;

        appendSubNodes(result, rootNode);
      });
    } else {
      //this.getPlugin('treeviewdragdrop').disable();
      argo.post('Reporting:Reporting:getTreeFavorites', {}, function (success, result) {
        if (!success) return;

        this.personal = result.personal;
        this.shared = result.shared;

        this.myReports = this.personal.reports;
        this.sharedReports = this.shared ? this.shared.reports : null;

        this.myDashboards = this.personal.dashboards;
        this.sharedDashboards = this.shared ? this.shared.dashboards : null;

        this.mySlideshows = this.personal.slideshows;
        this.sharedSlideshows = this.shared ? this.shared.slideshows : null;

        // append reports
        appendNodes(this.myReports, 'myreports', 'My Reports', rootNode);
        appendNodes(this.sharedReports, 'sharedreports', 'Shared Reports', rootNode);

        // append dashboards
        appendNodes(this.myDashboards, 'mydashboards', 'My Dashboards', rootNode);
        appendNodes(this.sharedDashboards, 'shareddashboards', 'Shared Dashboards', rootNode);

        // append slideshows
        appendNodes(this.mySlideshows, 'myslideshows', 'My Slideshows', this.getRootNode());
        appendNodes(this.sharedSlideshows, 'sharedslideshows', 'Shared Slideshows', rootNode);
      }, this);
    }
  } // loadTree
});

// get tree data
var getTreeData = function (root) {
  var childNodes = [];

  Ext.each(root.childNodes, function (cn) {
    //console.log(cn.raw.id);
    cn.raw.nFolderID = root.raw.nFolderID ? root.raw.nFolderID : cn.raw.nFolderID;
    cn.raw.aChildren = getTreeData(cn);

    childNodes.push(cn.raw);
  });

  //console.log(childNodes);
  return childNodes;
};

// append reports, dashboards, slideshows nodes
var appendSubNodes = function (datas, root) {
  console.log(datas);

  Ext.each(datas, function (items) {
    var subChildNodes = [];
    Ext.each(items.aChildren, function (item) {
      var itemId = items.sType == 'REPT' ? ('REPT_' + item.nReptID) : (items.sType == 'DASH' ?
        ('DASH_' + item.nDashID) : ('SLIDE_' + item.nSlideID));

      if (items.sType == 'REPT') {
        subChildNodes.push({
          id: itemId,
          text: item.sName,
          parentId: item.nFolderID,
          leaf: true,
          /* properties */
          nReptID: itemId,
          sUser: item.sUser,
          nFolderID: item.nFolderID,
          sName: item.sName,
          jDetails: item.jDetails
        })
      } else if (items.sType == 'DASH') {
        subChildNodes.push({
          id: itemId,
          text: item.sName,
          parentId: item.nFolderID,
          leaf: true,
          /* properties */
          nDashID: itemId,
          sUser: item.sUser,
          nFolderID: item.nFolderID,
          sName: item.sName,
          jDetails: item.jDetails
        })
      } else {
        subChildNodes.push({
          id: itemId,
          text: item.sName,
          parentId: item.nFolderID,
          leaf: true,
          /* properties */
          nSlideID: itemId,
          sUser: item.sUser,
          nFolderID: item.nFolderID,
          sName: item.sName,
          jDetails: item.jDetails
        })
      }
    });

    root.appendChild({
      id: items.nFolderID,
      text: items.sName,
      leaf: false,
      /* properties */
      nFolderID: items.nFolderID,
      sUser: items.sUser,
      sType: items.sType,
      sName: items.sName,
      jDetails: items.jDetails,
      children: subChildNodes
    });
  });
}; // append reports, dashboards, slideshows nodes

// append home nodes
var appendNodes = function (datas, rid, rtext, root) {
  console.log(datas);
  var childNodes = [];
  Ext.each(datas, function (items) {
    var subChildNodes = [];
    Ext.each(items.aChildren, function (item) {
      var itemId = items.sType == 'REPT' ? ('REPT_' + item.nReptID) : (items.sType == 'DASH' ?
        ('DASH_' + item.nDashID) : ('SLIDE_' + item.nSlideID));

      subChildNodes.push({
        id: itemId,
        text: item.sName,
        parentId: item.nFolderID,
        leaf: true,
        sUser: item.sUser
      })
    });

    childNodes.push({
      id: items.nFolderID,
      text: items.sName,
      sType: items.sType,
      sUser: items.sUser,
      leaf: false,
      children: subChildNodes
    });
  });

  root.appendChild({
    id: rid,
    text: rtext,
    leaf: false,
    children: childNodes
  });
}; // append home nodes
