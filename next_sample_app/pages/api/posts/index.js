const getPosts = () => {
    const posts = [];

    for (let i = 1; i <= 10; i++) {
        const date = new Date();
        date.setDate(date.getDate()-i);
        posts.push({
            id: i,
            title: `Article #${i}`,
            body: `Some content of the article ${i}`,
            publishedAt: date
        })
    }
    return posts;
}

export default (req, res) => {
    const posts = getPosts();
    res.statusCode = 200;
    res.json(posts)
}
