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
	
	function removeProperty(childNode) {
		--properties;
		$(childNode).closest(".property").remove();
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
		removeProperty(this);
	});
	
	// Form submission
	$("#mg").submit(function(e) {
		e.preventDefault();
		
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

		// Setup properties (process backward so we can delete properties with empty names)
		for (var i = properties - 1; i >= 0 ; --i) {
			// Skip empty property name
			if (propertyNames[i].value.trim().length == 0) {
				removeProperty(propertyNames[i]);
				continue;
			}
			
			config.properties.unshift(new Property(
				propertyNames[i].value, 
				propertyMethods[i].value, 
				propertyIsBoolean[i].checked
			));
		}
		
		if (config.properties.length == 0) {
			alert("You must add at least 1 property.");
			return;
		}
		
		$("pre").removeClass("hidden").text(getGenerator(this.language.value, config).generate());
	});
	
	// Initialize the properties section
	addProperty();
	$propertyContainer.sortable();
}());
