/* https://github.com/DiemenDesign/summernote-text-findnreplace */
(function(factory){
  if(typeof define==='function'&&define.amd){
    define(['jquery'],factory);
  }else if(typeof module==='object'&&module.exports){
    module.exports=factory(require('jquery'));
  }else{
    factory(window.jQuery);
  }
}(function($){
  $.extend(true,$.summernote.lang,{
    'en-US':{ /* English */
      findnreplace:{
        dialogTitle:'Find \'N Replace',
        tooltip:'Find \'N Replace',
        title:'Title',
        find:'Find',
        replace:'Replace',
        findBtn:'Find',
        replaceBtn:'Replace'
      }
    }
  });
  $.extend($.summernote.options,{
    findnreplace:{
      notTime:4800, // Time to display Notifications.
      highlight:'background-color:yellow;',
      closeAfter:true, // true|false Closes Dialog after search or replace.
      icon:'<i class="note-icon"><svg xmlns="http://www.w3.org/2000/svg" id="libre-findnreplace" viewBox="0 0 14 14" width="14" height="14"><path d="m 5.8,2.3764705 c 0.941176,0 1.811765,0.376471 2.423529,1.011765 l -1.741176,1.741176 4.117647,0 0,-4.117647 -1.411765,1.411765 C 8.317647,1.5529415 7.117647,1.0117645 5.8,1.0117645 c -2.423529,0 -4.423529,1.788236 -4.752941,4.117647 l 1.388235,0 C 2.741176,3.5529415 4.129412,2.3764705 5.8,2.3764705 Z m 3.8588235,6.282353 c 0.4470585,-0.611764 0.7764705,-1.341176 0.8705885,-2.164706 l -1.388236,0 c -0.305882,1.552942 -1.694117,2.752942 -3.364705,2.752942 -0.941177,0 -1.811765,-0.376471 -2.42353,-1.011765 L 5.094118,6.4941175 1,6.4941175 1,10.611765 2.411765,9.2000005 C 3.282353,10.070589 4.482353,10.611765 5.8,10.611765 c 1.058824,0 2.047059,-0.352942 2.847059,-0.9411765 L 11.988235,12.988236 13,11.97647 9.6588235,8.6588235 Z"/></svg></i>'
    }
  });
  $.extend($.summernote.plugins,{
    'findnreplace':function(context){
      var self=this;
      var ui=$.summernote.ui;
      var $note=context.layoutInfo.note;
      var $editor=context.layoutInfo.editor;
      var $editable=context.layoutInfo.editable;
      var options=context.options;
      var lang=options.langInfo;
      context.memo('button.findnreplace',function(){
        var button=ui.button({
          contents:options.findnreplace.icon,
          tooltip:lang.findnreplace.tooltip,
          click:function(e){
            context.invoke('findnreplace.show');
          }
        });
        return button.render();
      });
      this.initialize=function(){
        var $container=options.dialogsInBody?$(document.body):$editor;
        var body='<div class="form-group"><label for="note-findnreplace-title" class="control-label col-xs-2">'+lang.findnreplace.find+'</label><div class="input-group col-xs-10"><input type="text" id="note-findnreplace-find" class="form-control note-findnreplace-find"></div></div>'+
        '<div class="form-group"><label for="note-findnreplace-replace" class="control-label col-xs-2">'+lang.findnreplace.replace+'</label><div class="input-group col-xs-10"><input type="text" id="note-findnreplace-replace" class="form-control note-findnreplace-replace" onchange="$(\'.note-findnreplace-btn\').text(\''+lang.findnreplace.replaceBtn+'\')"></div></div>';
        this.$dialog=ui.dialog({
          title:lang.findnreplace.dialogTitle,
          body:body,
          footer:'<button href="#" class="btn btn-primary note-findnreplace-btn">'+lang.findnreplace.findBtn+'</button>'
        }).render().appendTo($container);
      };
      this.destroy=function(){
        ui.hideDialog(this.$dialog);
        this.$dialog.remove();
      };
      this.bindEnterKey=function($input,$btn){
        $input.on('keypress',function(event){
          if(event.keyCode===13)$btn.trigger('click');
        });
      };
      this.bindLabels=function(){
      	self.$dialog.find('.form-control:first').focus().select();
      	self.$dialog.find('label').on('click',function(){
      		$(this).parent().find('.form-control:first').focus();
      	});
      };
      this.show=function(){
        this.showLinkDialog()
      };
      this.showLinkDialog=function(){
        return $.Deferred(function(deferred){
          var $editBtn=self.$dialog.find('.note-findnreplace-btn');
          ui.onDialogShown(self.$dialog,function(){
            $(".modal-backdrop.in").hide();
            context.triggerEvent('dialog.shown');
            $editBtn.click(function(e){
              e.preventDefault();
              var text=$note.summernote().html();
              var findText=$('.note-findnreplace-find').val();
              var replaceText=$('.note-findnreplace-replace').val();
              var regex=new RegExp(findText,"g");
              if(findText!=''){
                if(replaceText==''){
                  var replacedText=text.replace(regex,'<span class="note-findnreplace" style="'+options.findnreplace.highlight+'">'+findText+'</span>');
                }else{
                  var replacedText=text.replace(regex,'<span class="note-findnreplace" style="'+options.findnreplace.highlight+'">'+replaceText+'</span>');
                }
                $note.summernote('code',replacedText);
                if(options.findnreplace.closeAfter==true)$(".modal.in").modal("hide");
                setTimeout(function(){
                  $editor.find('.note-findnreplace').contents().unwrap('span');
                },options.findnreplace.notTime);
              }
            });
            self.bindEnterKey($editBtn);
            self.bindLabels();
          });
          ui.onDialogHidden(self.$dialog,function(){
            $editBtn.off('click');
            if(deferred.state()==='pending')deferred.reject();
          });
          ui.showDialog(self.$dialog);
        });
      };
    }
  });
}));
