/**
 * @author johnsonj <me@justinjohnson.org>
 */
Formatter = (function() {
	function getIndent(formatter) {
		var i, indent = "";
		
		for (i = 0; i < formatter.indent; ++i ) {
			indent += formatter.config.indent;
		}
		
		return indent;	
	}
	
	function Formatter(config) {
		this.config = config;
		this.content = "";
		this.indent = 0;
	}
	
	Formatter.prototype.openBlock = function(content) {
		if ( this.config.openingBraces == "newline" ) {
			this.writeln(content);
			this.writeln("{");
		} else {
			this.writeln(content + " {");
		}
		
		++this.indent;
		
		return this;
	};
	
	Formatter.prototype.closeBlock = function() {
		--this.indent;
		this.writeln("}");
		
		return this;
	};
	
	Formatter.prototype.writeln = function(content) {
		if (content) {
			this.content += getIndent(this) + content;
		}
		
		this.content += "\n";
		
		return this;
	};
	
	Formatter.prototype.propertyName = function(name) {
		if (this.config.propertyCase == "snake") {
			return name.replace(/\s+/g, "_");
		}
		
		return name.replace(/\s+(.)/g, function(matcher, p1) {
			return p1.toUpperCase();
		});
	};
	
	Formatter.prototype.toString = function() {
		return this.content;
	};
	
	return Formatter;
}());