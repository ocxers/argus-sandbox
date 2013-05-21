argo.post('Reporting:Reporting:getCharts',{},function(success, result){
	var chartDef = result.categories[0].charts[0];
	
	console.log(chartDef);
	
	var chart = Ext.create('Ext.chart.Chart',{
		animate: true,
		shadow: true,
		store: Ext.create('Ext.data.JsonStore',{
		   model: 'ExtAS.AllesModel',
		   data: chartDef.data
		}),
		axes: chartDef.config.axes,
		series: chartDef.config.series
	});
	
	var popup = Ext.create('Ext.window.Window',{
		width: 800,
		height: 600,
		minHeight: 400,
		minWidth: 550,
		hidden: false,
		maximizable: true,
		title: 'Bar Chart',
		autoShow: true,
		layout: 'fit',
		items: chart
	});
	
	popup.show();
});
