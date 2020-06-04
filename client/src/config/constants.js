const prod = {
    urls: {
      studentLogin: "https://chronofactorem.herokuapp.com/"
    }
  };
  
  const dev = {
    urls: {
      studentLogin: "http://localhost:3000"
    }
  };
  
  const configuration = {
    // Add common constants here
    ...(process.env.NODE_ENV === "development" ? dev : prod)
  };
  
  export default configuration;
  