const express = require("express");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const userProtobufPath = path.join(__dirname, "user.proto");

const userPackageDefinition = protoLoader.loadSync(userProtobufPath);
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;

const PORT = 1212;
const userClient = new userProto.UserService(`192.168.1.32:${PORT}`, grpc.ChannelCredentials.createInsecure());

const app = express();

app.get("/:name", async (req, res) => {
    const { name } = req.params;
    userClient.createUser({ name: name }, (err, response) => {
        if (!err) res.send(response);
        else res.send(err);
    });
});

app.listen(3000, "192.168.1.32", () => console.log("HTTP server is running..."));
