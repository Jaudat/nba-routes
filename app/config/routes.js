var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var Home = require("../components/Home.js");
var Main = require("../components/Main.js");
var Login = require("../components/login-register/Login.js");
var Logout = require("../components/login-register/Logout.js");
var Register = require("../components/login-register/Register.js");
var Schedule = require("../components/Schedule.js");
var AddGame = require("../components/secure/AddGame.js");

var routes = (
        <Route handler={Main}>
          <Route name="login" handler={Login} />
          <Route name="logout" handler={Logout} />
          <Route name="register" handler={Register} />
          <Route name="schedule" path="/schedule/:team" handler={Schedule} />
          <Route name="addGame" path="/addgame/:team" handler={AddGame} />
          <Route name="home" path="/" handler={Home} />
        </Route>
);

module.exports = routes;
