/**
 * @author johnsonj <me@justinjohnson.org>
 */
Property = (function() {
	/**
	 * Convert snake case and camel case into space separated words
	 */
	function prepareName(name) {
		return name
			// Remove snake case
			.replace(/_/g, " ")
			// Remove camel case
			.replace(/([a-z])([A-Z])/g, "$1 $2") // e.g.: hasHttpConnection -> has Http Connection
			.replace(/([A-Z])([a-z])/g, " $1$2") // e.g.: hasHTTPConnection -> has HTTP Connection
			// Remove extra whitespace
			.replace(/\s+/g, " ")
			.trim();
	}
	
	function Property(name, methods, isBoolean) {
		this.name = prepareName(name);
		this.useSet = methods == "all" || methods == "set";
		this.useGet = methods == "all" || methods == "get";
		this.isBoolean = isBoolean == "1";
	}

	return Property;
}());
