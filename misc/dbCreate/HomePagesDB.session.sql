-- start of file


-- @block
CREATE TABLE IF NOT EXISTS BlogSnippets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL UNIQUE,
    summary VARCHAR(255) NOT NULL UNIQUE,
    posted TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- @block
INSERT INTO BlogSnippets (title, summary, posted)
VALUES
    ('Some First Blog', 'This is the generic description for the first blog.', TIMESTAMP('2024-10-13')),
    ('Another Second Blog', 'Blog 2: Electric Boogaloo is the finest blog!', DEFAULT),
    ('A Third Blog', 'This one was underwhelming, unfortunately.', TIMESTAMP('2023-10-13')),
    ('A Fourth Blog: The Awakening', 'Surprisingly, this was a successful reboot of the original duology.', TIMESTAMP('2023-10-12')),
    ('Fifth Blog: No Time to Write', 'A tear-jerker of a finale to the blog series. What a legend.', DEFAULT);

-- @block
SELECT * FROM BlogSnippets
ORDER BY title ASC;

-- @block
DROP TABLE BlogSnippets