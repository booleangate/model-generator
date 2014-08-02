/**
 * @author johnsonj <me@justinjohnson.org>
 */
(function() {
	var $propertyContainer = $("#property-container"),
		propertyTemplate = $("#tmpl-property").html(),
		propertyCount = 0;
		
	function initForm() {
		var config;
		
		try {
			config = Config.copy(JSON.parse(decodeURIComponent(window.location.search.substr(1))));
			
			initBasics(config);
			initPropertyList(config.properties);
			generateModel(config);
		} catch (e) {
			// Something has gone wrong with either population or generation.  Add a new property if no properties were added
			if (!propertyCount) {
				addProperty();
			}
			
			throw e;
		} 
	}
	
	function initBasics(config) {
		var elements = $("#mg")[0].elements, key;
		
		for (key in config) {
			if (key == "properties" || !config.hasOwnProperty(key)) {
				continue;
			}
			
			elements[key].value = config[key];
		}
	}
	
	function initPropertyList(properties) {
		removeAllProperties();
		
		$.each(properties, function(i, property) {
			addProperty(property);
		});
	}
		
	function addProperty(property) {
		var $property = $(propertyTemplate);
		
		++propertyCount;
		$propertyContainer.append($property);
		
		// No property data provided for auto-popuplation.  Just auto-focus.
		if (property == null) {
			$property.find("input[type='text']").focus();
		} else {
			$property.find("*[name]").each(function(i, input) {
				// The form field names are like "property${propertyname}[]" where ${propertyname} is the actual property name of Property.
				// Yo dawg, I heard you like properties...
				var propertyName = input.name.match(/property(\w*)/)[1];
				
				// Normalize the propertyName (e.g.: "IsBoolean" -> "isBoolean"). 
				propertyName = propertyName[0].toLowerCase() + propertyName.substr(1);
				
				if (input.type == "checkbox") {
					input.checked = property[propertyName];
				} else {
					$(input).val(property[propertyName]);
				}
			});
		}
	}
	
	function removeProperty(childNode) {
		--propertyCount;
		$(childNode).closest(".property").remove();
		
		// If there are no more properties left, add an empty one.
		if (propertyCount == 0) {
			addProperty();
		}
	}
	
	function removeAllProperties() {
		$propertyContainer.html("");
		propertyCount = 0;
	}
	
	function getProperty(form, arrayName) {
		return propertyCount == 1 ? [form.elements[arrayName]] : form.elements[arrayName];
	}
	
	function getGenerator(config) {
		// TODO: add more language generators
		return new PhpGenerator(config);
	}
	
	function generateModel(config) {
		$("pre").removeClass("hidden").text(getGenerator(config).generate());
	}
	
	function showError(message) {
		$("#error-container").removeClass("hidden").html(message);
	}
	
	function hideError() {
		$("#error-container").addClass("hidden");
	}
	
	// Adding properties
	$("#btn-add-property").click(function(e) {
		addProperty();
	});
	
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
				this.language.value,
				this.defaultScope.value,
				this.indentStyle.value,
				this.openingBraces.value,
				this.propertyCase.value			
			),
			propertyNames = getProperty(this, "propertyName[]"),
			propertyMethods = getProperty(this, "propertyMethods[]"),
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
		
		history.pushState({}, "", "?" + JSON.stringify(config));
		
		generateModel(config);
	});
	
	// State change handler
	$(window).on("popstate", initForm); 

	
	// Initialize the form and properties section
	initForm();
	$propertyContainer.sortable();
}());
