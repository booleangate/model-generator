(function() {
	var $propertyContainer = $("#property-container"),
		propertyTemplate = $("#tmpl-property").html();
		
	function addProperty() {
		var $property = $(propertyTemplate);
		$propertyContainer.append($property);
		$property.find("input[type='text']").focus();
	}
	
	// Adding properties
	$("#btn-add-property").click(addProperty);
	
	// Removing properties
	$propertyContainer.on("click", ".btn-delete", function() {
		$(this).closest(".property").remove();
	});
	
	// Form submission
	$("#mg").submit(function(e) {
		e.preventDefault();
	});
	
	addProperty();	
}());
