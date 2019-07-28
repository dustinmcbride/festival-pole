var exec = require('child_process').exec;

// Create shutdown function
export default (callback) => {
    exec('shutdown now', function(error, stdout, stderr){
      callback(error, stdout, stderr);
    });
}

