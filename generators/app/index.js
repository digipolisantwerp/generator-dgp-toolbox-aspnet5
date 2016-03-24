'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var del = require('del');
var nd = require('node-dir');
var Guid = require('guid');

module.exports = yeoman.generators.Base.extend({
  
  prompting: function () {
    var done = this.async();

    // Greet the user
    this.log(yosay('Welcome to the ' + chalk.red('dgp-toolbox-aspnetcore') + ' generator!'));

    // Ask project properties
    var prompts = [{
      type: 'input',
      name: 'deleteContent',
      message: 'Delete the contents of this directory before generation (.git will be preserved) ? (y/n):',
      default: 'y'
    },
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter the name of the new toolbox project (without Digipolis.Toolbox):'
    },
    {
      type: 'input',
      name: 'projectDescription',
      message: 'Enter a short description for the new project:'
    },
    {
      type: 'input',
      name: 'projectAuthor',
      message: 'Enter your name:'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;     // To access props later use this.props.someOption;
      done();
    }.bind(this));
  },

  writing: function () {
  
    console.log('Emptying target folder...');
    if ( this.props.deleteContent == 'y' )
        del.sync(['**/*', '!.git', '!.git/**/*'], { force: true, dot: true });
    
    var projectName = this.props.projectName;
    var lowerProjectName = projectName.toLowerCase(); 
    
    var solutionItemsGuid = Guid.create();
    var srcGuid = Guid.create();
    var testGuid = Guid.create();
    var starterKitGuid = Guid.create();
    var unitGuid = Guid.create();
    
    var desc = this.props.projectDescription;
    var author = this.props.projectAuthor;
    
    var copyOptions = { 
      process: function(contents) {
        var str = contents.toString();
        var result = str.replace(/StarterKit-Description/g, desc)
                        .replace(/StarterKit-Author/g, author)
                        .replace(/StarterKit/g, projectName)
                        .replace(/starterkit/g, lowerProjectName)
                        .replace(/C3E0690A-0044-402C-90D2-2DC0FF14980F/g, solutionItemsGuid.value.toUpperCase())
                        .replace(/05A3A5CE-4659-4E00-A4BB-4129AEBEE7D0/g, srcGuid.value.toUpperCase())
                        .replace(/079636FA-0D93-4251-921A-013355153BF5/g, testGuid.value.toUpperCase())
                        .replace(/BD79C050-331F-4733-87DE-F650976253B5/g, starterKitGuid.value.toUpperCase())
                        .replace(/0A3016FD-A06C-4AA1-A843-DEA6A2F01696/g, unitGuid.value.toUpperCase());
        return result;
      }
    };
     
     var source = this.sourceRoot();
     var dest = this.destinationRoot();
     var fs = this.fs;   
     
     console.log('Creation of project skeleton...');
     
     nd.files(source, function (err, files) {
      for ( var i = 0; i < files.length; i++ ) {
        var filename = files[i].replace(/StarterKit/g, projectName)
                               .replace(/starterkit/g, lowerProjectName)
                               .replace(".npmignore", ".gitignore")
                               .replace(source, dest);
        fs.copy(files[i], filename, copyOptions);
      }
    });
  },

  install: function () {
    // this.installDependencies();
  }
});
