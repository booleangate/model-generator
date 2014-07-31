function Config(language, defaultScope, indent, openingBraces, identifierCase) {
	this.language = language;
	this.defaultScope = defaultScore;
	this.indent = indent;
	this.openingBraces = openingBraces;
	this.identifierCase = identifierCase;
	this.properties = [];
}

Config.prototype.addProperty = function(property) {
	this.properties.push(property);
};
