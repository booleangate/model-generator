/**
 * @author johnsonj <me@justinjohnson.org>
 */
function Config(className, language, defaultScope, indentStyle, openingBraces, propertyCase) {
	this.className = className;
	this.language = language;
	this.defaultScope = defaultScope;
	this.indentStyle = indentStyle;
	this.openingBraces = openingBraces;
	this.propertyCase = propertyCase;
	this.properties = [];
}

Config.copy = function(object) {
	var config = new Config(object.className, object.language, object.defaultScope, object.indentStyle, object.openingBraces, object.propertyCase),
		i;

	for (var i = 0; i< object.properties.length; ++i) {
		config.properties.push(Property.copy(object.properties[i]));
	}
	
	return config;
};

Config.prototype.getIndentString = function() {
	return this.indentStyle == "tabs" ? "\t" : "    ";
};
