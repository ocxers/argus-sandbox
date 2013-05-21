Ext.define('User.Administration',{
	extend:'Ext.Window',
	
	width: 825,
	height: 600,
	title: 'User Administration',
	layout: 'border',
	modal: true,
	border: false,
	
	initComponent:function () {
		var me = this;

		this.items = [{
			xtype: 'treepanel',
			itemId: 'tree',
			region: 'west',
			width: 250,
			split: true,
			layout: 'fit',
			style: 'border-width: 0 1px 0 0;',
			tbar: [{
				itemId: 'btnAddGroup',
				text: 'Add Group',
				scope: this,
				handler: function() {
					this.editGroup();
				}
			},'->',{
				itemId: 'btnAddAccount',
				text: 'Add Account',
				disabled: true,
				scope: this,
				handler: function() {
					this.editAccount();
				}
			}],
			rootVisible:false,
			border:false,
			listeners: {
				scope: this,
				selectionChange: function(tree, records) {
					var node = records[0];
					if (node.data.leaf) {
						this.down('#btnAddAccount').setDisabled(true);
						this.editAccount(node.raw.id);
					} else {
						this.down('#btnAddAccount').setDisabled(false);
						this.editGroup(node.raw.id);
					}
				}
			},
			viewConfig:{
				plugins:{
					ptype: 'treeviewdragdrop',
					appendOnly: true,
					containerScroll: true
				},
				listeners:{
					beforedrop:function (node, data, overModel) {
						var isLeaf = data.records[0].data.leaf;
						if (!isLeaf) {
							return false;
						}
					},
					drop:function (node, data, overModel, dropPosition) {
						var userGroupNodes = Ext.getCmp('userTree').getRootNode().childNodes;
						var userGroupNodesLen = userGroupNodes.length;
						var userGroupsAccounts = [];
						
						for (var i = 0; i < userGroupNodesLen; i++) {
							var userAccounts = [];
							var userGroupNodesChildNodes = userGroupNodes[i].childNodes;
							for (var j = 0; j < userGroupNodesChildNodes.length; j++) {
								userAccounts.push(userGroupNodesChildNodes[j].raw.id);
							}
							
							userGroupsAccounts.push({
								nIdUserGroup:userGroupNodes[i].data.id,
								aUserAccts:userAccounts
							});
						}
						
						console.log(userGroupsAccounts);
					}
				}
			}
		}];

		this.callParent(arguments);
		
		this.tree = this.down('#tree');
		this.cards = this.down('#cards');
		this.userAccount = this.down('#userAccount');
		this.userGroup = this.down('#userGroup');
	}
});