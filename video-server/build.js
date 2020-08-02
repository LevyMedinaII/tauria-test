const fs = require('fs-extra');
const childProcess = require('child_process');


try {
    // Remove current build
    fs.removeSync('./dist/');
    // Transpile the typescript files
    const proc = childProcess.exec('tsc --build tsconfig.prod.json');

    let scriptOutput = '';
    proc.stdout.on('data', (data) => {
        console.log('stderr: ' + data);
        data=data.toString();
        scriptOutput+=data;
    })
    proc.stderr.on('data', (data) => {
        console.log('stderr: ' + data);
        data=data.toString();
        scriptOutput+=data;
    })
    proc.on('close', (code) => {
        if (code !== 0) {
            throw Error("Build failed")
        }
    })
} catch (err) {
    console.log(err);
}
