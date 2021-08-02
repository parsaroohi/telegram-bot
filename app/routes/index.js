const Router = require("express").Router();
const paymentRoute = require("./paymentRoute");
const panelRoutes = require("./panelRoutes");

Router.use(paymentRoute);
Router.use(panelRoutes);

module.exports = Router;