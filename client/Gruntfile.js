module.exports = function(grunt) {

  grunt.initConfig({
    // Watch for changes in source files
    watch: {
      src: {
        files: ['src/**/*.js'],
        tasks: ['browserify:src'] 
      }
    },
    // Launch a server to test locally
    connect: {
      server: {
        options: {
          port: 8888,
          keepalive: true,
          open: 'http://localhost:8888/test/demo'
        }
      }
    },
    // Create ES5 bundle from ES6 source
    browserify: {
      src: {
        files: {
          'dist/csh-map-ui.js': ['src/index.js']
        },
        options: {
          transform: ['babelify', 'stringify']
        }
      },
      dist: {
        files: {
          'dist/csh-map-ui.min.js': ['src/index.js']
        },
        options: {
          transform: ['babelify', 'stringify', 'uglifyify']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['browserify:src', 'watch']);
  grunt.registerTask('build' ['browserify:dist']);
  grunt.registerTask('serve', ['connect']);

};
