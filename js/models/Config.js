/**
 * @author johnsonj <me@justinjohnson.org>
 */
function Config(className, defaultScope, indent, openingBraces, propertyCase) {
	this.className = className;
	this.defaultScope = defaultScope;
	this.indent = indent == "tabs" ? "\t" : "    ";
	this.openingBraces = openingBraces;
	this.propertyCase = propertyCase;
	this.properties = [];
}

Config.prototype.addProperty = function(property) {
	this.properties.push(property);
};
