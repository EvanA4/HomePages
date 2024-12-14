

-- @block
CREATE TABLE Blogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT(511) NOT NULL,
    content TEXT(16383) NOT NULL,
    postdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Experiences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    link VARCHAR(255),
    timeperiod VARCHAR(63) NOT NULL,
    bullets TEXT(511) NOT NULL
);

CREATE TABLE Projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL UNIQUE,
    link VARCHAR(255),
    summary TEXT(511) NOT NULL,
    flags VARCHAR(255)
);

-- @block
SHOW TABLES;

-- @block
DROP TABLE Blogs;
DROP TABLE Experiences;
DROP TABLE Projects;

-- @block
SELECT * FROM Blogs;

-- @block
INSERT INTO Experiences (title, link, timeperiod, bullets) VALUES ("exp1", "/blogs", "911", "[\"exp1 bullet1\",\"exp1 bullet2\",\"exp1 bullet3\"]")