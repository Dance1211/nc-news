/**
 * Checks if a string is a positive integer
 * @param {String} str String to be tested
 * @returns True if the parameter is a valid positive integer, false otherwise
 */
module.exports.isValidPositiveInteger = (str) => {
	try {
		return /^[1-9]\d*$/.test(str); 
	} catch (error) {
		return false;
	}
};

/**
 * Check if an object has a single property of prop with a given type 
 * @param {Object} obj Object to be tested
 * @param {String} prop Property that obj must have
 * @param {Constructor} constructor Constructor of the property
 * @returns True if the object is valid, false otherwise
 */
module.exports.hasSpecificPropertyOnly = (obj, prop, constructor = Object) => {
	// Check there's only one key and that it's inc_votes;
	try {
		const keys = Object.keys(obj);
		return (keys.length === 1 && obj[prop].constructor === constructor);
	} catch (error) {
		return false;
	}
};