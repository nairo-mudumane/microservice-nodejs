import express from "express";

const server = express();

server.use(express.json());

server.listen(3031, () => console.log("auth service running"));
