const express = require('express');
const mysql = require('mysql2');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Manushya@123',
  database: 'assignment',
  insecureAuth: true,
});

db.connect((err) => {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("MYSQL Connected");
})

app.use(express.json());

app.get('/api/v1/longest-duration-movies', async (req, res, next) => {
  try {
    let result = await db.promise().query('SELECT tconst, primaryTitle, runtimeMinutes, genres from movies ORDER BY runtimeminutes DESC LIMIT 10')

    return res.json({
      logerDurationMovies: result[0]
    })
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    })
  }
})


/*
  body: {
    title,
    primaryTitle,
    runTimeMinutes,
    genres
  }
*/
app.post('/api/v1/new-movie', async (req, res, next) => {
  try {
    if (!req?.body?.title) {
      return res.json({
        message: "titleType is required"
      })
    }

    if (!req?.body?.primaryTitle) {
      return res.json({
        message: "primaryTitle is required"
      })
    }

    if (!req?.body?.runTimeMinutes) {
      return res.json({
        message: "runTimeMinutes is required"
      })
    }

    if (!req?.body?.genres) {
      return res.json({
        message: "genres is required"
      })
    }

    let topElem = await db.promise().query('SELECT * FROM movies ORDER BY tconst DESC LIMIT 1');

    const highestTconst = topElem[0][0].tconst;
    const currentNumberPart = parseInt(highestTconst.substring(2));
    const newNumberPart = currentNumberPart + 1;
    const newTconst = `tt${newNumberPart.toString().padStart(7, '0')}`;

    const newElement = {
      tconst: newTconst,
      title: req?.body?.title,
      primaryTitle: req?.body?.primaryTitle,
      runTimeMinutes: req?.body?.runTimeMinutes,
      genres: req?.body?.genres
    };

    let result = await db.promise().query(`INSERT INTO movies SET ?`, newElement);

    return res.json({
      message: "Success",
      result: result[0]
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong."
    })
  }
})

app.get('/api/v1/top-rated-movies', async (req, res, next) => {
  try {
    let result = await db.promise().query('SELECT mv.tconst, mv.primaryTitle, mv.genres, rt.averageRating from movies mv LEFT JOIN ratings rt ON mv.tconst = rt.tconst WHERE rt.averageRating > 6.0')

    return res.json({
      topRatedMovies: result[0]
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong."
    })
  }
})

app.get('/api/v1/genre-movies-with-subtotals', async (req, res, next) => {
  try {
    let result = await db.promise().query(`SELECT Genre, primaryTitle, numVotes
    FROM (
      SELECT m.genres AS Genre, m.primaryTitle, r.numVotes
      FROM movies m
      JOIN ratings r ON m.tconst = r.tconst
    
      UNION
    
      SELECT m.genres AS Genre, 'TOTAL' AS primaryTitle, SUM(r.numVotes) AS numVotes
      FROM movies m
      JOIN ratings r ON m.tconst = r.tconst
      GROUP BY m.genres
    ) AS sub
    ORDER BY Genre, primaryTitle`)

    return res.json({
      movieWithSubtotals: result[0]
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong."
    })
  }
})

app.post('/api/v1/update-runtime-minutes', async (req, res, next) => {
  try {
    let result = await db.promise().query(`
    UPDATE movies
    SET runtimeMinutes = 
      CASE
        WHEN genres = 'Documentary' THEN runtimeMinutes + 15
        WHEN genres = 'Animation' THEN runtimeMinutes + 30
        ELSE runtimeMinutes + 45
      END;
    `)

    return res.json({
      updateRuntime: result[0]
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong."
    })
  }
})

app.listen(3000, () => {
  console.log("Server started on port 3000");
})