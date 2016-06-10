(function ($, ns, channel, window, undefined) {

    var actionDef = {
        icon: 'coral-Icon--globe',
        text: Granite.I18n.get('Configure Shared Content'),
        handler: function (editable, param, target) { // will be called on click
        	var originalDialogSrc = editable.config.dialogSrc;
        	var originalDialog = editable.config.dialog;
        	
        	var dialogSrcArray = editable.config.dialogSrc.split(".html");
        	var langRootRegexp = /^(\/content\/([^/]+\/)+([a-zA-Z]{2}([_-][a-zA-Z]{2})?))(|\/.*)$/g;
        	var match = langRootRegexp.exec(dialogSrcArray[1]);
        	
        	var siteWideDialogSrc = dialogSrcArray[0].replace("_cq_dialog", "_cq_dialogsitewide") +
						        	".html" +
						        	match[1] +
						        	"/jcr:content/sitewideprops/" +
						        	editable.type;
        	
        	editable.config.dialogSrc = siteWideDialogSrc;
        	editable.config.dialog = editable.config.dialog.replace("cq:dialog", "cq:dialogsitewide");
        	
        	ns.edit.actions.doConfigure(editable);
        	
        	//set the dialog and dialogSrc back to the original values so normal edit dialog continues to work
        	editable.config.dialogSrc = originalDialogSrc;
        	editable.config.dialog = originalDialog;
        	
            // do not close toolbar
            return false;
        },
        /*
         * In the event that we need to restrict this to specific components or something, we would potentially
         * do that in this "condition" function. If we don't, we , we would do that here. Otherwise, leave it out!
         */
        //Restrict to users with correct permissions and if the dialog exists
        condition: function(editable) {
            var enabled = ns.page.info.sitewideComponentProps && ns.page.info.sitewideComponentProps.enabled;
        	var canModify = ns.page.info.permissions && ns.page.info.permissions.modify;
            return !!enabled && !!editable.config.dialog && canModify;
        },
        isNonMulti: true
    };

    // we listen to the messaging channel
    // to figure out when a layer got activated
    channel.on('cq-layer-activated', function (ev) {
        // we continue if the user switched to the Edit layer
        if (ev.layer === 'Edit') {
            // we use the editable toolbar and register an additional action
            ns.EditorFrame.editableToolbar.registerAction('COMMON-CONTENT', actionDef);
        }
    });

}(jQuery, Granite.author, jQuery(document), this));
