Ext.define('ExtAS.AllesModel',{
	extend: 'Ext.data.Model',
	//
	constructor: function(){
		this.callParent(arguments);
		Ext.apply(this.data, this.raw);
	} //constructor
});


//------------------------------------------------------------------------------


Ext.copyObj = function(o){
	return Ext.apply({},o);
};


Ext.applyDeep = function(o, c){
	if (o && c && typeof c == 'object') {
		for (var p in c){
			o[p] = (Ext.isObject(o[p]) && Ext.isObject(c[p])) ? Ext.apply(o[p], c[p]) : c[p];
		}
	}
	return o;
};


Ext.override(Ext.Component,{
	initComponent: function(){
		this.callParent(arguments);
		
		if (typeof this.infoBadge === 'undefined') return;
		this.one('afterrender',function(){
			var html = Ext.String.format('<span class="info-badge" data-qtip="{0}"/>', this.infoBadge);
			$(html).appendTo(this.el.dom);
		},this);
	}
});


Ext.AbstractComponent.prototype.one = function (eventName, fn, scope, options) {
	if (typeof options === 'undefined') options = {};
	options.single = true;
	
	this.on(eventName, fn, scope, options);
};
Ext.app.Controller.prototype.one = function (eventName, fn, scope, options) {
	if (typeof options === 'undefined') options = {};
	options.single = true;
	
	this.on(eventName, fn, scope, options);
};
Ext.data.AbstractStore.prototype.one = function (eventName, fn, scope, options) {
	if (typeof options === 'undefined') options = {};
	options.single = true;
	
	this.on(eventName, fn, scope, options);
};


Ext.define('Ext.form.Field',{
	extend: 'Ext.form.Field',
	setValueQuiet: function(value) {
		this.suspendEvents(false);
		this.setValue(value);
		this.resumeEvents();
	}
});
Ext.form.Field.prototype.setValueQuiet = function(value) {
	this.suspendEvents(false);
	this.setValue(value);
	this.resumeEvents();
};


Ext.override(Ext.form.field.Base,{
	initComponent: function(){
		this.callParent(arguments);
		
		this.one('afterrender',function(){
			this.ownerForm = (this.up('form') || null);
		},this);
		
		this.on('change',function(){
			if (!this.ownerForm) return;
			this.ownerForm.fireEvent('change',true);
			this.ownerForm.fireEvent('changes',true);
			this.ownerForm.fireEvent('unsaved',true);
			this.ownerForm.fireEvent('unsavedchanges',true);
		},this);
	}
});


Ext.override(Ext.form.DateField,{
	initComponent: function(){
		this.altFormats = utils.formats.date+'|'+utils.localFormats.date;
		this.submitFormat = utils.formats.date;
		this.format = utils.localFormats.date;
		
		this.callParent(arguments);
	}
});


Ext.override(Ext.form.TimeField,{
	initComponent: function(){
		this.altFormats = utils.formats.time+'|'+utils.localFormats.time;
		this.submitFormat = utils.formats.time;
		this.format = utils.localFormats.time;
		
		this.callParent(arguments);
	}
});


Ext.override(Ext.tab.Tab,{
	initComponent: function(){
		if (this.card) Ext.apply(this, this.card.tabConfig);
		
		this.callParent(arguments);
	}
});


Ext.override(Ext.form.Panel,{
	clearFieldValues: function() {
		var fields = this.getFormFields(true);
		Ext.each(fields, function(field) {
			field.setValue('');
		},this);
	}, //clearFieldValues
	
	isDirty: function() {
		return this.getForm().isDirty();
	}, //isDirty
	
	reset: function() {
		return this.getForm().reset();
	}, //isDirty
	
	getFormField: function(name) {
		return this.getForm().findField(name);
	}, //getFormField
	
	getFormFields: function(asArray) {
		if (typeof asArray === 'undefined') asArray = true;
		
		var fieldsArr = this.queryBy(function(field){
			if (typeof field.initialConfig.name === 'undefined') {
				return false;
			} else {
				return true;
			}
		});
		
		if (asArray) return fieldsArr;
		
		fieldsObj = {};
		$.each(fieldsArr,function(i,field){
			switch (typeof fieldsObj[field.initialConfig.name]) {
				case 'undefined':
					fieldsObj[field.name] = field;
				break;
				
				case 'array':
					fieldsObj[field.name].push(field);
				break;
				
				default:
					var temp = fieldsObj[field.name];
					fieldsObj[field.name] = [temp];
					fieldsObj[field.name].push(field);
				break;
			}
		});
		return fieldsObj;
	}, //getFormFields
	
	getFieldValues: function() {
		var fieldsArr = this.getFormFields();
		var valuesObj = {};
		
		for (var i = 0; i < fieldsArr.length; i++) {
			var field = fieldsArr[i];
			var name  = fieldsArr[i].name;
			var value = fieldsArr[i].getValue();
			
			if (fieldsArr[i].xtype === 'datefield') value = Ext.Date.format(value, utils.formats.date);
			if (fieldsArr[i].xtype === 'timefield') value = Ext.Date.format(value, utils.formats.time);
			if (fieldsArr[i].xtype === 'radio') {
				if (value === true) valuesObj[name] = field.inputValue;
				continue;
			}
			
			// set values for names in the following formats:
			//  - 'name'
			//  - 'complex.object.property'
			//  - 'multiple.inputs.asarray[]'
			var keys = name.split('.');
			var totalDepth = keys.length;
			
			var objOrig = valuesObj;
			var objNext = objOrig;
			Ext.each(keys, function(key, depth) {
				var isArray = (key.substring(key.length-2) === '[]');
				if (isArray) key = key.substring(0, key.length-2);
				
				if (typeof objNext[key] === 'undefined') {
					if (isArray) {
						objNext[key] = [];
					} else {
						objNext[key] = {};
					}
				}
				
				if (depth === totalDepth - 1) {
					if (isArray) {
						objNext[key].push(value);
					} else {
						objNext[key] = value;
					}
				}
				
				objNext = objNext[key];
			}, this);
			valuesObj = objOrig;
		}
		return valuesObj;
	}, //getFieldValues
	
	setFieldValues: function(values) {
		var setValue = function(field, value) {
			if (field.getXType() === 'radiogroup') {
				Ext.each(field.items.items, function(radio) {
					if (radio.value === value) radio.setValue(true);
				}, this);
			} else {
				field.setValue(value);
			}
		};
		
		var fields = this.getFormFields(true);
		Ext.each(fields, function(field) {
			var name = field.getName();
			
			// set values for names in the following formats:
			//  - 'name'
			//  - 'complex.object.property'
			//  - 'multiple.inputs.asarray[]'
			var keys = name.split('.');
			var totalDepth = keys.length;
			
			var objOrig = values;
			var objNext = objOrig;
			Ext.each(keys, function(key, depth) {
				var isArray = (key.substring(key.length-2) === '[]');
				if (isArray) key = key.substring(0, key.length-2);
				
				if (!objNext || (typeof objNext[key] === 'undefined')) return false;
				
				if (depth === totalDepth - 1) {
					if (isArray) {
						setValue(field, objNext[key][0]);
						objNext[key] = objNext[key].slice(1);
					} else {
						setValue(field, objNext[key]);
					}
				}
				
				objNext = objNext[key];
			}, this);
		}, this);
	}, //setFieldValues
	
	validateFormFields: function() {
		return this.form.isValid();
	} //validateFormFields
});


Ext.define('Ext.button.Button',{
	extend: 'Ext.button.Button',
	showTooltip: function(title, msg) {
		if (typeof msg === 'undefined') {
			msg = title;
			title = '';
		}
		var tooltip = Ext.create('Ext.ToolTip',{
			target: this.btnEl.dom,
			anchor: 'bottom',
			width: 300,
			cls: 'mini-tooltip',
			dismissDelay: 5000,
			closable: true,
			title: title,
			html: msg.replace(/\n/g, '<br>').replace(/\\n/g, '<br>')
		});
		tooltip.show();
		
		this.one('destroy',function(){
			tooltip.destroy();
		},this);
		this.one('hide',function(){
			tooltip.destroy();
		},this);
	}, //showTooltip
	success: function() {
		this.showTooltip('Success','Successfully saved form.');
	}, //success
	failure: function() {
		this.showTooltip('Failure','Error saving form...');
	} //failure
});