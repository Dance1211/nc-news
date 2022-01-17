module.exports.formatUsersData = (userData) => {
  return mapData(userData, ["username", "name", "avatar_url"]);
}

module.exports.formatTopicsData = (topicData) => {
  return mapData(topicData, ["slug", "description"]);
}

module.exports.formatArticlesData = (articleData) => {
  return mapData(articleData, ["title", "body", "votes", "topic", "author", "created_at"]);
}

module.exports.formatCommentData = (commentData) => {
  return mapData(commentData, ["body", "article_id", "votes", "author", "created_at"]);
}

function mapData(dataArr, keyArr) {
  return dataArr.map(data => {
    return keyArr.map(key => data[key]);
  })
}