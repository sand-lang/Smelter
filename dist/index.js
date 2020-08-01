"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var yaml_1 = __importDefault(require("yaml"));
var tar_1 = __importDefault(require("tar"));
var fs = __importStar(require("fs"));
var Logger_1 = require("./utils/Logger");
var meta = require("../assets/meta.json");
var program = new commander_1.default.Command();
program.version(meta.version);
var logger = new Logger_1.Logger(false);
var projectSmelt = "name: <%NAME%>\nversion: <%VERSION%>\ndescription: <%DESCRIPTION%>\ngit: https://github/sand-lang/smelter.git";
var projectMain = "import \"io\"\n\nfn main() {\n    std::print(\"Hello, Everyone!\");\n}";
program
    .command("i [package_name]")
    .option("--save-dev")
    .option("-l, --local")
    .description("Install A Package")
    .action(function (package_name) {
    // Get Option, Dev? Local?
    var local = false;
    var dev = false;
    if (program.args.includes("-l") || program.args.includes("--local")) {
        local = true;
    }
    if (program.args.includes("--save-dev")) {
        dev = true;
    }
    logger.Debug("local: " + local + " | dev: " + dev);
    // Check for package.smelt
    if (!fs.existsSync("./project.smelt")) {
        logger.Error("This project isn't initialised! Please run: " + logger.FgGreen + "smelter init [Project Name]" + logger.FgRed + " in the parent directory.");
        return;
    }
    var projectUnparsed = fs.readFileSync("./project.smelt", { encoding: 'utf-8' });
    var projectParsed = yaml_1.default.parse(projectUnparsed);
    if (projectParsed["deps"] == null) {
        projectParsed["deps"] = {};
    }
    // TODO Link Api To Get Version & Download .tar
    projectParsed["deps"][package_name] = {};
    projectParsed["deps"][package_name]["version"] = ">0.0.0";
    projectParsed["deps"][package_name]["type"] = dev ? "dev" : local ? "local" : "global";
    projectParsed["deps"][package_name]["url"] = "https://smelter.io/api/v1/" + package_name + "@0.0.0.tar";
    var projectEnd = yaml_1.default.stringify(projectParsed);
    fs.writeFileSync("./project.smelt", projectEnd);
});
program
    .command("init [project_name]")
    .description("Starts a project")
    .action(function (project_name) {
    var nameSafe = project_name.split(" ").join("-");
    if (fs.existsSync("./" + nameSafe)) {
        logger.Error("The project path already exists!");
        return;
    }
    fs.mkdirSync("./" + nameSafe);
    fs.writeFileSync("./" + nameSafe + "/project.smelt", yaml_1.default.stringify(yaml_1.default.parse(projectSmelt
        .replace("<%NAME%>", project_name)
        .replace("<%VERSION%>", "1.0.0")
        .replace("<%DESCRIPTION%>", "A Generated Sand Project Called " + project_name))));
    logger.Info("project.smelt saved");
    fs.mkdirSync("./" + nameSafe + "/src");
    fs.writeFileSync("./" + nameSafe + "/src/main.sd", projectMain);
    logger.Info("main.sd saved");
    logger.Info("Successfully made " + project_name + " in ./" + nameSafe + "!");
});
program
    .command("publish")
    .description("Publish the project")
    .action(function () {
    if (!fs.existsSync("./project.smelt")) {
        logger.Error("This project isn't initialised! Please run: " + logger.FgGreen + "smelter init [Project Name]" + logger.FgRed + " in the parent directory.");
        return;
    }
    var projectUnparsed = fs.readFileSync("./project.smelt", { encoding: 'utf-8' });
    var projectParsed = yaml_1.default.parse(projectUnparsed);
    tar_1.default.c({
        gzip: true,
        file: projectParsed.name + "@" + projectParsed.version + ".tgz"
    }, ["./src", "./glass"]);
});
program.parse(process.argv);
