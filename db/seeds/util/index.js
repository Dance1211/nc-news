module.exports.formatUsersData = (userData) => {
  return userData.map(({username, name, avatar_url}) => {
    return [username, name, avatar_url];
  });
}

module.exports.formatTopicsData = (topicData) => {
  return topicData.map(({slug, description}) => {
    return [slug, description];
  });
}

module.exports.formatArticlesData = (articleData) => {
  return articleData.map(({title, body, votes, topic, author, created_at}) => {
    return [title, body, votes, topic, author, created_at];
  });
}

module.exports.formatCommentData = (commentData) => {
  return commentData.map(({body, article_id, votes, author, created_at}) => {
    return [body, article_id, votes, author, created_at];
  });
}