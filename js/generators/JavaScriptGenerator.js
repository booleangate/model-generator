/**
 * @author johnsonj <me@justinjohnson.org>
 */
JavaScriptGenerator = (function() {
	function getMethodPrefixes(property) {
		var prefixes = [];
		
		if (property.useSet()) {
			prefixes.push("set");
		}
		
		if (property.useGet()) {
			if (property.isBoolean) {
				prefixes.push("is");
			}
			else {
				prefixes.push("get");
			}
		}
		
		return prefixes;
	}
	
	function getMethodArguments(prefix, identifier) {
		if (prefix == "set") {
			return "(" + identifier + ")";
		}
		
		return "()";
	}
	
	function getMethodBody(prefix, identifier) {
		if (prefix == "set") {
			return "this." + identifier + " = " + identifier + ";";
		}
		
		return "return this." + identifier + ";";
	}
	
	function JavaScriptGenerator(config) {
		this.config = config;
		this.formatter = new Formatter(config);
	}
	
	JavaScriptGenerator.prototype.generate = function() {
		var f = this.formatter,
			c = this.config;
		
		// Class header
		f.writeln("/**")
			.writeln(" * Generated by model-generator on " + new Date())
			.writeln(" */")
			.openBlock("function " + c.className + "()");
			
		// Declare the properties	
		$.each(c.properties, function(i, property) {
			f.writeln("this." + f.propertyName(property.name) + " = null;");
		});
		
		f.closeBlock()
			.writeln();
			
		// Write the getters and setters
		$.each(c.properties, function(i, property) {
			var prefixes = getMethodPrefixes(property);
			
			$.each(prefixes, function(j, prefix) {
				var identifier = f.propertyName(property.name);
				
				f.openBlock(c.className + ".prototype." + f.methodName(prefix, property.name) + " = function" + getMethodArguments(prefix, identifier))
					.writeln(getMethodBody(prefix, identifier))
					.closeBlock();
					
				if (i + 1 != c.properties.length || j + 1 != prefixes.length) {
					f.writeln();
				}
			});
		});
			
		return f.toString();
	};

	return JavaScriptGenerator;
}());