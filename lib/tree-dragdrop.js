{
	xtype: 'treepanel',
	/* ... */
	viewConfig:{
		plugins:{
			ptype: 'treeviewdragdrop',
			appendOnly: true,
			containerScroll: true
		},
		listeners:{
			scope: this,
			beforedrop: function(node, data, overModel) {
				// only drop if node is not a directory
				return (!!data.records[0].data.leaf);
			},
			drop: function(node, data, overModel, dropPosition) {
				// only allow drop into directory, not to re-order
				if (dropPosition !== 'append') return false;
			}
		}
	}
}