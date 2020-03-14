const spawn = require("child_process").spawn;

module.exports.status = 'sleeping'; // failure, sleeping, running, error
module.exports.errmsg = '';
module.exports.data = ''

var manMadeKill = false;

// valine-checker process
var vcProcess;

init = function(){
    vcProcess = spawn('python3', ['checker/valine-checker.py']);
    vcProcess.on('error', (err) => {
        exports.status = 'failure';
        exports.errmsg = err.message;
    });
    
    vcProcess.stderr.on('data', (chank) => {
        if(manMadeKill) return;
        exports.errmsg = chank;
    });
    
    vcProcess.on('close', (code, signal) => {
        if(manMadeKill) return;
        if(code != 0){
          exports.status = 'error';
        }else if(code == 0){
          exports.status = 'sleeping';
        }
    });
    
    vcProcess.stdout.on('data', (chank) => {
        if(manMadeKill) return;
        console.log('Got a STD exports.data: ' + chank)
        exports.data = chank.toString();
    })
}

exports.launch = function(){
    if(exports.status == 'running'){
        return {
            code: 200,
            msg: 'Valine Checker is already running.'
        }
    }
    init()
    exports.status = 'running'
    manMadeKill = false;
    return {
        code: 200,
        msg: 'success.'
    }
}

exports.stop = function(){
    if(vcProcess.killed){
        exports.status = 'sleeping'
        return {
            code: 200,
            msg: 'Valine Checker is already stopped.'
        }
    }
    if(vcProcess.kill()){
        manMadeKill = true;
        exports.status = 'sleeping'
        return {
            code: 200,
            msg: 'success.'
        }
    }else{
        return {
            code: -1,
            msg: 'stop failure.'
        }
    }
}

exports.getpid = function(){
    return vcProcess.pid;
}