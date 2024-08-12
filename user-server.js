const mysql2 = require("mysql2");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const userProtobufPath = path.join(__dirname, "user.proto");

const userPackageDefinition = protoLoader.loadSync(userProtobufPath);
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;

const createUser = async (call, callback) => {
    const name = call.request.name;
    connection.query("INSERT INTO users (name) VALUES (?)", [name], (err, results) => {
        if (!err) callback(null, { message: "Data inserted successfully!" });
        else callback(err, null);
    });
}

const grpcServer = new grpc.Server();
grpcServer.addService(userProto.UserService.service, { createUser: createUser });

const PORT = 1212;
grpcServer.bindAsync(`192.168.1.32:${PORT}`, grpc.ServerCredentials.createInsecure(), () => console.log("gRPC server is running without any issue..."));

const connection = mysql2.createPool({
    port: 3306,
    host: "192.168.1.32",
    database: "user",
    user: "root",
    password: ""
});

connection.getConnection((err) => {
    if (!err) console.log("MySQL server is running...");
    else throw err;
});
