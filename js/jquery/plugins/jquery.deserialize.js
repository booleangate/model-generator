(function ($) {
    $.deserialize = function (str, options) {
        var pairs = str.split(/&amp;|&/i),
            result = {},
            options = options || {},
            i, kv, matches, normalizedKey
            
        for (i = 0; i < pairs.length; i++) {
            kv = pairs[i].split('=');
            kv[0] = decodeURIComponent(kv[0]);
            
            if (!options.except || options.except.indexOf(kv[0]) == -1) {
            	if (/^\w+\[\]$/.test(kv[0])) {
            		normalizedKey = kv[0].substr(0, kv[0].length - 2);
            		
            		if (typeof result[normalizedKey] === 'undefined') {
                        result[normalizedKey] = [];
                    }
                    
                    result[normalizedKey].push(kv[1]);
            	}
                else if (/^\w+\[\w+\]$/.test(kv[0])) {
                    matches = kv[0].match(/^(\w+)\[(\w+)\]$/);
                    
                    if (typeof result[matches[1]] === 'undefined') {
                        result[matches[1]] = {};
                    }
                    
                    result[matches[1]][matches[2]] = decodeURIComponent(kv[1]);
                } else {
                    result[kv[0]] = decodeURIComponent(kv[1]);
                }
            }
        }
        
        return result;
    };

    $.fn.deserialize = function (options) {
        return $.deserialize($(this).serialize(), options);
    };
})(jQuery);