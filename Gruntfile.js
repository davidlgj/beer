

module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'app/css/main.css': 'app/sass/main.scss'
                }
            }
        },
        watch: {
            sass: {
                files: ['app/sass/*.scss'],
                tasks: ['sass']
            },
        
            live: {
                options: { livereload: true },
                files: ['app/**/*','!app/sass/*.scss']
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

};