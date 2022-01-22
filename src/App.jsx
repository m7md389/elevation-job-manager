import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PageNotFound from "./components/PageNotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <NavBar />

      <Switch>
        <Route
          exact
          path="/"
          render={() => <Home APOD={AstronomyPictureOfTheDay} />}
        />
        <Route path="/" component={<PageNotFound />} />
      </Switch>

      <Footer />
    </Router>
  );
}

export default App;
