
var fs          = require('fs'),
    grunt       = require('grunt'),
    exec        = require('execSync'),
    description = 'Move the minified code and tests.js over to the ' +
                  'gh-pages branch',
    tests,
    minCode,
    fullCode;

grunt.registerTask('toGhPages', description, function () {
  var finished = this.async();

  tests    = fs.readFileSync('../tests/tests.js').toString();
  minCode  = fs.readFileSync('pablo.min.js').toString();
  fullCode = fs.readFileSync('../pablo.js').toString();

  fs.unlinkSync('pablo.min.js');

  warn('git stash');
  exec.code('git stash');

  warn('checkout gh-pages');
  exec.code('git checkout gh-pages');

  ifFailureWarning();

  warn('Overwriting ../tests/tests.js');
  fs.writeFileSync('../tests/tests.js', tests, 'utf8');

  warn('Overwriting ../downloads/pablo.js');
  fs.writeFileSync('../downloads/pablo.js', fullCode, 'utf8');

  warn('Overwriting ../downloads/pablo.min.js');
  fs.writeFileSync('../downloads/pablo.min.js', minCode, 'utf8');

  warn('git commit ../tests/tests.js');
  exec.code('git commit ../tests/tests.js -m "Add latest tests"');

  warn('git commit ../downloads/pablo.js');
  exec.code('git commit ../downloads/pablo.js -m "Add latest pablo.js"');

  warn('git commit ../downloads/pablo.min.js');
  exec.code('git commit ../downloads/pablo.min.js -m "Add latest pablo.min.js"');

  warn('git checkout master');
  exec.code('git checkout master');

  warn('git stash pop');
  exec.code('git stash pop');

  console.log('If succesful do "git push origin gh-pages"');

  finished();
});

function warn (msg) {
  console.log('[grunt] Attempting: ' + msg);
}

function ifFailureWarning () {
  console.log('[grunt] Warning: If anything fails now, you may remain on the ' + 
              'gh-pages branch. Checkout to wherever you where and do ' + 
              '"git stash pop".');
}