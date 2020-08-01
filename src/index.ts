import commander from 'commander';
import yaml from 'yaml';
import tar from 'tar';
import * as cliSpinners from 'cli-spinners'
import * as fs from 'fs'
import {Logger} from "./utils/Logger";

const meta = require("../assets/meta.json")

const program = new commander.Command()
program.version(meta.version);

const logger = new Logger(false);

const projectSmelt = `name: <%NAME%>
version: <%VERSION%>
description: <%DESCRIPTION%>
git: https://github/sand-lang/smelter.git`

const projectMain = `import "io"

fn main() {
    std::print("Hello, Everyone!");
}`

program
    .command("i [package_name]")
    .option("--save-dev")
    .option("-l, --local")
    .description("Install A Package")
    .action((package_name: string) => {
        // Get Option, Dev? Local?
        let local: boolean = false;
        let dev: boolean = false;
        if(program.args.includes("-l") || program.args.includes("--local")) {
            local = true;
        } if (program.args.includes("--save-dev")) {
            dev = true;
        }
        logger.Debug(`local: ${local} | dev: ${dev}`);

        // Check for package.smelt
        if(!fs.existsSync(`./project.smelt`)) {
            logger.Error(`This project isn't initialised! Please run: ${logger.FgGreen}smelter init [Project Name]${logger.FgRed} in the parent directory.`)
            return;
        }

        let projectUnparsed = fs.readFileSync("./project.smelt", { encoding: 'utf-8' })
        let projectParsed = yaml.parse(projectUnparsed)

        if(projectParsed["deps"] == null) {
            projectParsed["deps"] = {};
        }

        // TODO Link Api To Get Version & Download .tar

        projectParsed["deps"][package_name] = {}
        projectParsed["deps"][package_name]["version"] = ">0.0.0"
        projectParsed["deps"][package_name]["type"] = dev ? "dev" : local ? "local" : "global"
        projectParsed["deps"][package_name]["url"] = `https://smelter.io/api/v1/${package_name}@0.0.0.tar`

        let projectEnd = yaml.stringify(projectParsed);
        fs.writeFileSync("./project.smelt", projectEnd);
    })

program
    .command("init [project_name]")
    .description("Starts a project")
    .action((project_name: string) => {
        let nameSafe: string = project_name.split(" ").join("-")
        if(fs.existsSync(`./${nameSafe}`)) {
            logger.Error("The project path already exists!")
            return;
        }

        fs.mkdirSync(`./${nameSafe}`)
        fs.writeFileSync(`./${nameSafe}/project.smelt`, yaml.stringify(yaml.parse(projectSmelt
            .replace("<%NAME%>", project_name)
            .replace("<%VERSION%>", "1.0.0")
            .replace("<%DESCRIPTION%>", `A Generated Sand Project Called ${project_name}`)))
        )
        logger.Info(`project.smelt saved`)
        fs.mkdirSync(`./${nameSafe}/src`)
        fs.writeFileSync(`./${nameSafe}/src/main.sd`, projectMain)
        logger.Info(`main.sd saved`)
        logger.Info(`Successfully made ${project_name} in ./${nameSafe}!`)
    })

program
    .command("publish")
    .description("Publish the project")
    .action(() => {

        if(!fs.existsSync(`./project.smelt`)) {
            logger.Error(`This project isn't initialised! Please run: ${logger.FgGreen}smelter init [Project Name]${logger.FgRed} in the parent directory.`)
            return;
        }

        let projectUnparsed = fs.readFileSync("./project.smelt", { encoding: 'utf-8' })
        let projectParsed = yaml.parse(projectUnparsed)

        tar.c({
            gzip: true,
            file: `${projectParsed.name}@${projectParsed.version}.tgz`
        }, ["./src", "./glass"]);

        //TODO Upload to api & server
    });

program.parse(process.argv)
