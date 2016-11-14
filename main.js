/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */
/*
 * Author:Michael Mitchell
 * Date:11/14/16
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/** extension that allows the user to create new documents with a specific extension then pulls a template
 for that type of file and assigns the contents of the newly created file to that template*/
define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus          = brackets.getModule("command/Menus"),
        NativeApp      = brackets.getModule("utils/NativeApp"),
        DocumentManager = brackets.getModule("document/DocumentManager"),        
        MainViewManager = brackets.getModule("view/MainViewManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        Document       = brackets.getModule("document/Document"),
        DocumentCommandHandlers = brackets.getModule("document/DocumentCommandHandlers"),
        FileSystem     = brackets.getModule("filesystem/FileSystem"),
        File           = brackets.getModule("filesystem/File"),
        LanguageManager = brackets.getModule("language/LanguageManager"),
        FileUtils      = brackets.getModule("file/FileUtils");
     /** default templates for documents**/   
    var JsTemplate = require('text!JavaScript_Template.js');
    var HTMLTemplate = require('text!HTML_Template.HTML');
    var PhpTemplate = require('text!PHP_Template.php');
    var CssTemplate = require('text!CSS_Template.css');
    


    function handleTemplateChange() {
    	var doc = FileSystem.showOpenDialog(false, false, "Template","", "" , function (string1, array){//creates an open document prompt and assigns its path to an array
            var doc1 = FileSystem.getFileForPath(array[0]);//takes the file path and makes a document out of it
            doc1.read(function(string2, string3, stats ){//reads the document determines its extension then determines which template it will change
                if(FileUtils.getFileExtension(array[0])=="js"||FileUtils.getFileExtension(array[0])=="JS")
                    JsTemplate = string3;
                if(FileUtils.getFileExtension(array[0])=="HTML"||FileUtils.getFileExtension(array[0])=="html")
                    HTMLTemplate = string3;
                if(FileUtils.getFileExtension(array[0])=="css"||FileUtils.getFileExtension(array[0])=="CSS")
                    CssTemplate = string3;
                if(FileUtils.getFileExtension(array[0])=="php"||FileUtils.getFileExtension(array[0])=="PHP")
                    PhpTemplate = string3;
            });
            }
            );
    }
    
    // creates new document and puts a template in it
    function handleNewFile(extension, template) {
        var p1 = ProjectManager.createNewItem("", "Test."+extension, false, false);//creates new item
        p1.then(//when done creating inserts the template into the new document
        		function(){		
        		EditorManager.getFocusedEditor()._codeMirror.setValue(template);//changes the contents of the document to the template
        		}
        );
    }
    //different handlers for creating different types of documents
    function handleNewHTML(){
        handleNewFile("html",HTMLTemplate);
    }
    function handleNewPHP(){
        handleNewFile("php",PhpTemplate);
    }
    function handleNewCSS(){
        handleNewFile("css",CssTemplate);
    }
    function handleNewHTML(){
        handleNewFile("HTML",HTMLTemplate);
    }
    //creates new Javascript document
    function handleNewJS() {
        handleNewFile("js",JsTemplate);
    }
    /** inserts a template into the current document that is determined by which type of document you're working on**/
    function handleInsertTemplate() {
        var lang = EditorManager.getFocusedEditor().document.getLanguage();//gets the language for the currently open document
        //decides and adds the template that was determined by the extension
        if(lang.getName()==LanguageManager.getLanguageForExtension("js").getName()){
            EditorManager.getFocusedEditor()._codeMirror.setValue(JsTemplate);
        }
        
        else if(lang.getName()==LanguageManager.getLanguageForExtension("html").getName()){
            EditorManager.getFocusedEditor()._codeMirror.setValue(HTMLTemplate);
        }
        
        else if(lang.getName()==LanguageManager.getLanguageForExtension("php").getName()){
            EditorManager.getFocusedEditor()._codeMirror.setValue(PhpTemplate);
        }
        
        else if(lang.getName()==LanguageManager.getLanguageForExtension("css").getName()){
            EditorManager.getFocusedEditor()._codeMirror.setValue(CssTemplate);
        }
    }


    // registering commands to the handlers
    var MY_COMMAND_ID = "Template.InsertTemplate";   // package-style naming to avoid collisions
    CommandManager.register("Insert Template", MY_COMMAND_ID, handleInsertTemplate);
    
    var MY_COMMAND_ID2 = "Template.create_new_HTML";
    CommandManager.register("New HTML", MY_COMMAND_ID2, handleNewHTML);
    
    var MY_COMMAND_ID3 = "Template.create_new_JS";
    CommandManager.register("New JS", MY_COMMAND_ID3, handleNewJS);
    
    var MY_COMMAND_ID4 = "Template.create_new_PHP";
    CommandManager.register("New PHP", MY_COMMAND_ID4, handleNewPHP);
    
    var MY_COMMAND_ID5 = "Template.create_new_CSS";
    CommandManager.register("New CSS", MY_COMMAND_ID5, handleNewCSS);
    
    var MY_COMMAND_ID6 = "Template.TemplateChange";
    CommandManager.register("Change Template", MY_COMMAND_ID6, handleTemplateChange);

    // creates new menu items for the new commands
    
    var menu2 = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    
    menu.addMenuItem(MY_COMMAND_ID);
    
    menu.addMenuItem(MY_COMMAND_ID6);
    
    menu2.addMenuItem(MY_COMMAND_ID2);
    
    menu2.addMenuItem(MY_COMMAND_ID3);
    
    menu2.addMenuItem(MY_COMMAND_ID4);

    menu2.addMenuItem(MY_COMMAND_ID5);
    

    
    
});