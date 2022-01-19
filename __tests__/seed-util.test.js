const { formatUsersData, formatTopicsData, formatArticlesData, formatCommentData } = require("../db/seeds/util");

describe("UTIL formatUsersData", () => {
	test("Formatting an empty array gives an empty array", () => {
		expect(formatUsersData([])).toEqual([]);
	});
	test("Formatting an array of a single user object gives it formatted", () => {
		const users = [
			{
				username: "tickle122",
				name: "Tom Tickle",
				avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953"
			}
		];
		expect(formatUsersData(users)).toEqual([
			[
				"tickle122",
				"Tom Tickle",
				"https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953"
			]
		]);
	});
	test("Formatting an array of multiple user objects gives them formatted", () => {
		const users = [
			{
				username: "tickle122",
				name: "Tom Tickle",
				avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953"
			},
			{
				username: "grumpy19",
				name: "Paul Grump",
				avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013"
			},
			{
				username: "happyamy2016",
				name: "Amy Happy",
				avatar_url:
          "https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729"
			}
		];
		expect(formatUsersData(users)).toEqual([
			[
				"tickle122",
				"Tom Tickle",
				"https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953"
			],
			[
				"grumpy19",
				"Paul Grump",
				"https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013"
			],
			[
				"happyamy2016",
				"Amy Happy",
				"https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729"
			]
		]);
	});
	test("Function returns a new array", () => {
		const users = [
			{
				username: "tickle122",
				name: "Tom Tickle",
				avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953"
			},
			{
				username: "grumpy19",
				name: "Paul Grump",
				avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013"
			}
		];
		const formattedUsers = formatUsersData(users);
		expect(formattedUsers).not.toBe(users);
	});
});

describe("UTIL formatTopicsData", () => {
	test("Formatting an empty array gives an empty array", () => {
		expect(formatTopicsData([])).toEqual([]);
	});
	test("Formatting an array of a single topic object gives it formatted", () => {
		const topics = [
			{
				description: "desc1",
				slug: "slug1"
			}
		];
		expect(formatTopicsData(topics)).toEqual([
			[
				"slug1",
				"desc1"
			]
		]);
	});
	test("Formatting an array of multiple topic objects gives them formatted", () => {
		const topics = [
			{
				description: "desc1",
				slug: "slug1"
			},
			{
				description: "desc2",
				slug: "slug2"
			},
			{
				description: "desc3",
				slug: "slug3"
			}
		];
		expect(formatTopicsData(topics)).toEqual([
			[
				"slug1",
				"desc1"
			],
			[
				"slug2",
				"desc2"
			],
			[
				"slug3",
				"desc3"
			]
		]);
	});
	test("Function returns a new array", () => {
		const topics = [
			{
				description: "desc1",
				slug: "slug1"
			},
			{
				description: "desc2",
				slug: "slug2"
			}
		];
		const formattedtopics = formatTopicsData(topics);
		expect(formattedtopics).not.toBe(topics);
	});
});

describe("UTIL formatArticlesData", () => {
	test("Formatting an empty array gives an empty array", () => {
		expect(formatArticlesData([])).toEqual([]);
	});
	test("Formatting an array of a single article object gives it formatted", () => {
		const articles = [
			{
				title: "title1",
				topic: "topic1",
				author: "author1",
				body: "body1",
				created_at: "2022-01-17T12:49:51.072Z",
				votes: 0
			}
		];
		expect(formatArticlesData(articles)).toEqual([
			[
				"title1",
				"body1",
				0,
				"topic1",
				"author1",
				"2022-01-17T12:49:51.072Z"
			]
		]);
	});
	test("Formatting an array of multiple article objects gives them formatted", () => {
		const articles = [
			{
				title: "title1",
				topic: "topic1",
				author: "author1",
				body: "body1",
				created_at: "2022-01-17T12:49:51.072Z",
				votes: 0
			},
			{
				title: "title2",
				topic: "topic2",
				author: "author2",
				body: "body2",
				created_at: "2022-01-17T12:49:51.072Z",
				votes: 5
			},
			{
				title: "title3",
				topic: "topic3",
				author: "author3",
				body: "body3",
				created_at: "2022-01-17T12:49:51.072Z",
				votes: 10
			}
		];
		expect(formatArticlesData(articles)).toEqual([
			[
				"title1",
				"body1",
				0,
				"topic1",
				"author1",
				"2022-01-17T12:49:51.072Z"
			],
			[
				"title2",
				"body2",
				5,
				"topic2",
				"author2",
				"2022-01-17T12:49:51.072Z"
			],
			[
				"title3",
				"body3",
				10,
				"topic3",
				"author3",
				"2022-01-17T12:49:51.072Z"
			]
		]);
	});
	test("Function returns a new array", () => {
		const articles = [
			{
				title: "title1",
				topic: "topic1",
				author: "author1",
				body: "body1",
				created_at: "2022-01-17T12:49:51.072Z",
				votes: 0
			},
			{
				title: "title2",
				topic: "topic2",
				author: "author2",
				body: "body2",
				created_at: "2022-01-17T12:49:51.072Z",
				votes: 5
			}
		];
		const formattedArticles = formatArticlesData(articles);
		expect(formattedArticles).not.toBe(articles);
	});
});

describe("UTIL formatCommentData", () => {
	test("Formatting an empty array gives an empty array", () => {
		expect(formatCommentData([])).toEqual([]);
	});
	test("Formatting an array of a single comment object gives it formatted", () => {
		const comments = [
			{
				body: "body1",
				article_id: 1,
				votes: 0,
				author: "user1",
				created_at: "2022-01-17T12:49:51.072Z"
			}
		];
		expect(formatCommentData(comments)).toEqual([
			[
				"body1",
				1,
				0,
				"user1",
				"2022-01-17T12:49:51.072Z"
			]
		]);
	});
	test("Formatting an array of multiple comment objects gives them formatted", () => {
		const comments = [
			{
				body: "body1",
				article_id: 1,
				votes: 0,
				author: "user1",
				created_at: "2022-01-17T12:49:51.072Z"
			},
			{
				body: "body2",
				article_id: 2,
				votes: 50,
				author: "user2",
				created_at: "2022-01-17T12:49:51.072Z"
			},
			{
				body: "body3",
				article_id: 3,
				votes: -4,
				author: "user3",
				created_at: "2022-01-17T12:49:51.072Z"
			}
		];
		expect(formatCommentData(comments)).toEqual([
			[
				"body1",
				1,
				0,
				"user1",
				"2022-01-17T12:49:51.072Z"
			],
			[
				"body2",
				2,
				50,
				"user2",
				"2022-01-17T12:49:51.072Z"
			],
			[
				"body3",
				3,
				-4,
				"user3",
				"2022-01-17T12:49:51.072Z"
			]
		]);
	});
	test("Function returns a new array", () => {
		const comments = [
			[
				"body1",
				1,
				0,
				"user1",
				"2022-01-17T12:49:51.072Z"
			],
			[
				"body2",
				2,
				50,
				"user2",
				"2022-01-17T12:49:51.072Z"
			]
		];
		const formattedComments = formatCommentData(comments);
		expect(formattedComments).not.toBe(comments);
	});
});