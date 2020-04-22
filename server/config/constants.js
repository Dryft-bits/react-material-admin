const prod = {
  urls: {
    googleAuthCallback:
      "https://admin-chronofactorem.herokuapp.com/api/auth/google/callback",
    homePage: "https://admin-chronofactorem.herokuapp.com/helData"
  }
};

const dev = {
  urls: {
    googleAuthCallback: "http://localhost:5003/api/auth/google/callback",
    homePage: "http://localhost:3003/checkloggedin"
  }
};

const configuration = {
  cookieKey: "ilovemytimetable",
  ...(process.env.NODE_ENV === "development" ? dev : prod)
};

module.exports = configuration;
