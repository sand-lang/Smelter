"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var meta = require("../assets/meta.json");
var program = new commander_1.default.Command();
program.version(meta.version);
program
    .command("i [package_name]")
    .option("--save-dev")
    .description("Install A Package")
    .action(function (package_name) {
    console.log(package_name);
});
program
    .command("init [project_name]")
    .description("Starts a project")
    .action(function (project_name) {
    console.log(project_name);
});
program
    .command("publish")
    .description("Publish the project")
    .action(function () { });
program.parse(process.argv);
