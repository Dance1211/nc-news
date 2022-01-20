// Query formatting for the pg-format "format" function
module.exports.formatUsersData = (userData) => {
	return mapData(userData, ["username", "name", "avatar_url"]);
};

module.exports.formatTopicsData = (topicData) => {
	return mapData(topicData, ["slug", "description"]);
};

module.exports.formatArticlesData = (articleData) => {
	return mapData(articleData, ["title", "body", "votes", "topic", "author", "created_at"]);
};

module.exports.formatCommentData = (commentData) => {
	return mapData(commentData, ["body", "article_id", "votes", "author", "created_at"]);
};

// Take the objects in dataArr and transform them into arrays, selected and ordered by keyArr.
// E.g. [{keyA: "valA", keyB: "valB"}] --> [["valA", "valB"]]
function mapData(dataArr, keyArr) {
	return dataArr.map(data => {
		return keyArr.map(key => data[key]);
	});
}