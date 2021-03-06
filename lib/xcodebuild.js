"use strict";
var _ = require('lodash'), path = require('path'), proc = require('child_process');
function xcodebuild() {
    var cb = typeof (cb = _.last(arguments)) === 'function' ? cb : function () { };
    var action = typeof (action = _.first(arguments)) === 'string' ? action : null;
    var options = {};
    if (action) {
        var object = _.rest(arguments).shift();
        options = typeof object === 'object' ? object : options;
    }
    else {
        options = typeof (options = _.first(arguments)) === 'object' ? options : {};
    }
    var root = (options ? options.path : null) || process.cwd();
    var parameters = [];
    switch (action) {
        case 'showsdks':
            parameters.push('-showsdks');
            break;
        case 'clean':
        case 'build':
        case 'archive':
            parameters.push(action);
            break;
    }
    var availableOptions = ['scheme', 'configuration'];
    _.each(availableOptions, function (available) {
        if (options[available]) {
            parameters = parameters.concat(['-' + available, options[available]]);
        }
    });
    var buildDir = path.join(root, options.buildDir || 'build');
    console.log("BUILDDIR", buildDir);
    parameters.push("-sdk");
    parameters.push("iphonesimulator");
    parameters.push('SYMROOT=' + buildDir);
    //remove later
    parameters.push('ARCHS=x86_64');
    parameters.push('ONLY_ACTIVE_ARCH=NO');
    var child = proc.spawn('xcodebuild', parameters, {
        cwd: root
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.stdin.pipe(process.stdin);
    child.on('close', function () {
        cb();
    });
    return child;
}
module.exports = xcodebuild;
