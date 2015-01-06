/**
 * @author johnsonj <me@justinjohnson.org>
 */
Formatter = (function() {
	function getIndent(formatter) {
		var i, indent = "";
		
		for (i = 0; i < formatter.indent; ++i ) {
			indent += formatter.config.getIndentString();
		}
		
		return indent;	
	}
	
	function Formatter(config) {
		this.config = config;
		this.content = "";
		this.indent = 0;
	}
	
	Formatter.prototype.openBlock = function(content, blockOpen) {
		blockOpen = blockOpen || "{";
		
		if ( this.config.openingBraces == "newline" ) {
			this.writeln(content);
			this.writeln(blockOpen);
		} else {
			this.writeln(content + " " + blockOpen);
		}
		
		++this.indent;
		
		return this;
	};
	
	Formatter.prototype.closeBlock = function(blockClose) {
		--this.indent;
		this.writeln(blockClose || "}");
		
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
	
	
	Formatter.prototype.methodName = function(prefix, name) {
		// For boolean properties, do not prepend the "is" prefix if the property name starts with "is."
		if (prefix != "is" || name.substr(0, 3) != "is ") {
			name = prefix + " " + name;
		}
		
		return this.propertyName(name);
	};
	
	Formatter.prototype.toString = function() {
		return this.content;
	};
	
	return Formatter;
}());