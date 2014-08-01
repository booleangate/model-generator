/**
 * @author johnsonj <me@justinjohnson.org>
 */
(function() {
	var $propertyContainer = $("#property-container"),
		propertyTemplate = $("#tmpl-property").html(),
		propertyCount = 0;
		
	function addProperty() {
		var $property = $(propertyTemplate);
		
		++propertyCount;
		$propertyContainer.append($property);
		$property.find("input[type='text']").focus();
	}
	
	function removeProperty(childNode) {
		--propertyCount;
		$(childNode).closest(".property").remove();
	}
	
	function getProperty(form, arrayName) {
		return propertyCount == 1 ? [form.elements[arrayName]] : form.elements[arrayName];
	}
	
	function getGenerator(language, config) {
		// TODO: add more language generators
		return new PhpGenerator(config);
	}
	
	function showError(message) {
		$("#error-container").removeClass("hidden").html(message);
	}
	
	function hideError() {
		$("#error-container").addClass("hidden");
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
			propertyIsBoolean = getProperty(this, "propertyIsBoolean[]"),
			i;

		// Setup properties (process backward so we can delete properties with empty names)
		for (i = propertyCount - 1; i >= 0 ; --i) {
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
		
		// We've deleted all the invald properties. Add back one property field and show an error.
		if (propertyCount == 0) {
			addProperty();
			showError("You must add at least 1 property.");
			
			return false;
		}
		
		hideError();
		
		$("pre").removeClass("hidden").text(getGenerator(this.language.value, config).generate());
	});
	
	// Initialize the properties section
	addProperty();
	$propertyContainer.sortable();
}());
