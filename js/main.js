/**
 * @author johnsonj <me@justinjohnson.org>
 */
(function() {
	var $propertyContainer = $("#property-container"),
		propertyTemplate = $("#tmpl-property").html(),
		properties = 0;
		
	function addProperty() {
		var $property = $(propertyTemplate);
		
		++properties;
		$propertyContainer.append($property);
		$property.find("input[type='text']").focus();
	}
	
	function getProperty(form, arrayName) {
		return properties == 1 ? [form.elements[arrayName]] : form.elements[arrayName];
	}
	
	function getGenerator(language, config) {
		// TODO: add more language generators
		return new PhpGenerator(config);
	}
	
	// Adding properties
	$("#btn-add-property").click(addProperty);
	
	// Removing properties
	$propertyContainer.on("click", ".btn-delete", function() {
		--properties;
		$(this).closest(".property").remove();
	});
	
	// Form submission
	$("#mg").submit(function(e) {
		e.preventDefault();
		
		if ( properties == 0 ) {
			alert("You must add at least 1 property.");
			return;
		}
		
		// Setup class config
		var config = new Config(
				this.elements["className"].value,
				this.scope.value,
				this.indentCharacter.value,
				this.openingBraces.value,
				this.propertyCase.value			
			),
			propertyNames = getProperty(this, "propertyName[]"),
			propertyMethods = getProperty(this, "propertyMethod[]"),
			propertyIsBoolean = getProperty(this, "propertyIsBoolean[]");

		// Setup properties
		for (var i = 0; i < properties; ++i) {
			config.addProperty(new Property(
				propertyNames[i].value, 
				propertyMethods[i].value, 
				propertyIsBoolean[i].checked
			));
		}
		
		$("pre").removeClass("hidden").text(getGenerator(this.language.value, config).generate());
	});
	
	addProperty();	
}());
