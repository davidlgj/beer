

module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'cordova/www/css/main.css': 'cordova/www/sass/main.scss'
                }
            }
        },
        watch: {
            sass: {
                files: ['cordova/www/sass/*.scss'],
                tasks: ['sass']
            },
        
            live: {
                options: { livereload: true },
                files: ['cordova/www/app.js','cordova/www/**/*','!cordova/www/sass/*.scss']
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

};