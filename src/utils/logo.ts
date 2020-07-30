export function logo(version: string): void {
    const date = new Date();
    console.log(`
██╗  ██╗██████╗ ███╗   ███╗
╚██╗██╔╝██╔══██╗████╗ ████║
 ╚███╔╝ ██████╔╝██╔████╔██║
 ██╔██╗ ██╔═══╝ ██║╚██╔╝██║
██╔╝ ██╗██║     ██║ ╚═╝ ██║
╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝

Version: ${version} | OS: ${process.platform} | Time: ${date.getHours()}:${date.getMinutes()}
`)
}
