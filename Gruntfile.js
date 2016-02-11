module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    clean: ["public/dist"],

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['public/**/*.js'],
        dest: 'public/dist/client.js',
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options:{
        mangle: false
      },
      my_target: {
        files: {
          'public/dist/client.min.js': ['public/dist/client.js'],
        }
      }
    },

    eslint: {
      target: [ 'public/client/*.js', 'app/**/*.js', 'lib/*.js', './*.js' ]
    },

    cssmin: {
     options: {
      shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/dist/style.min.css' : ['public/style.css'] 
        }
      }  
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'eslint',
          'test',
          'clean',
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
    gitpush: {
      your_target: {
        options: {
          remote: 'live',
          branch: 'master'
        }
      } 
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-contrib-clean');


  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });


  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([ 'gitpush' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'clean',
    'eslint',
    'concat',
    'uglify',
    'cssmin',
    'test',
    'upload'
  ]);

  grunt.registerTask('start', ['nodemon']);


  grunt.registerTask('default', ['start']);

};
