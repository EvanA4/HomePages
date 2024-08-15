-- start of file


-- @block
CREATE TABLE IF NOT EXISTS FullBlogs (
    id INT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL UNIQUE,
    content TEXT(65535) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (title) REFERENCES BlogSnippets(title) ON DELETE CASCADE
);

-- @block
INSERT INTO FullBlogs (title, content)
VALUES
    ('Some First Blog', 'This is the generic description for the first blog. This is the full blog, though!'),
    ('Another Second Blog', 'Blog 2: Electric Boogaloo is the finest blog! This is the full blog, though!'),
    ('A Third Blog', 'This one was underwhelming, unfortunately. This is the full blog, though!'),
    ('A Fourth Blog: The Awakening', 'Surprisingly, this was a successful reboot of the original duology. This is the full blog, though!'),
    ('Fifth Blog: No Time to Write', 'A tear-jerker of a finale to the blog series. What a legend. This is the full blog, though!');

-- @block
SELECT * FROM FullBlogs
-- INNER JOIN BlogSnippets
-- ON FullBlogs.title = BlogSnippets.title
-- WHERE BlogSnippets.id = 1
-- ORDER BY BlogSnippets.title ASC;

-- @block
DROP TABLE FullBlogs