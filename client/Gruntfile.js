module.exports = function(grunt) {

  grunt.initConfig({
    // Clean build directory
    clean: {
      dev: ['dist/csh-map-ui.js'],
      dist: ['dist/csh-map-ui.min.js']
    },
    // Watch for changes in source files
    watch: {
      src: {
        files: ['src/**/*.js', 'src/**/*.html'],
        tasks: ['browserify', 'test']
      },
      css: {
        files: ['src/**/*.css'],
        tasks: ['copy:css']
      },
      spec: {
        files: ['spec/**/*.js'],
        tasks: ['test']
      }
    },
    // Launch a server to test locally
    connect: {
      server: {
        options: {
          port: 8888,
          keepalive: true,
          open: 'http://localhost:8888/demo'
        }
      }
    },
    // Create ES5 bundle from ES6 source
    browserify: {
      src: {
        files: {
          'dist/csh-map-ui.js': ['src/csh-map.js']
        },
        options: {
          transform: ['stringify', 'babelify']
        }
      }
    },
    // Minify ES5 bundle
    uglify: {
      dist: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/csh-map-ui.min.js': 'dist/csh-map-ui.js'
        }
      }
    },
    // Run unit tests
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    // Copy the CSS file
    copy: {
      css: {
        src: 'src/css/main.css',
        dest: 'dist/main.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['clean:dev', 'copy:css', 'browserify', 'watch']);
  grunt.registerTask('build', ['clean:dist', 'copy:css', 'browserify', 'uglify', 'test']);
  grunt.registerTask('test', ['karma'])
  grunt.registerTask('demo', ['connect']);

};
