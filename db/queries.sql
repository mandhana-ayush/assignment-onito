create database assigmment;
create database new;
use assignment;

CREATE TABLE IF NOT EXISTS movies(
	tconst varchar(64) unique NOT NULL,
    title char(24) NOT NULL,
    primaryTitle char(24) NOT NULL,
    runtimeMinutes INT(9) NOT NULL,
    genres TEXT NOT NULL,
    PRIMARY KEY (tconst)
);


CREATE TABLE IF NOT EXISTS ratings(
	tconst varchar(64) unique NOT NULL,
    averageRating FLOAT NOT NULL,
    numVotes INT NOT NULL,
    CONSTRAINT fk_ratings_tconst FOREIGN KEY (tconst) REFERENCES movies(tconst)
)


SELECT * from ratings;
SELECT * from movies;
