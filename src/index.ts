import commander from 'commander';
import * as cliSpinners from 'cli-spinners'

const meta = require("../assets/meta.json")

const program = new commander.Command()
program.version(meta.version);

program
    .command("i [package_name]")
    .option("--save-dev")
    .description("Install A Package")
    .action((package_name: string) => {
        console.log(package_name);
    })

program
    .command("init [project_name]")
    .description("Starts a project")
    .action((project_name: string) => {
        console.log(project_name)
    })

program
    .command("publish")
    .description("Publish the project")
    .action(() => { });

program.parse(process.argv)
