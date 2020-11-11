'use strict';
//var util = require('util');
const fs = require('fs')
const path = require("path")
const recursive = require('fs-readdir-recursive')

module.exports = {
    get: start
};

//workaround the missing ability of ffastrans to tell us about watchfolder status
async function get_pending(returnarray){
		var s_monitor_path = path.join(path.join(global.api_config["s_SYS_CACHE_DIR"],"wfs"),"");
		//enrich workflow names for pending tickets
		var found_incoming = [];
		 await recursive(s_monitor_path).forEach(function(fname){
			if (fname.indexOf("grow") != -1){ 
			if (fname.indexOf("/i/") != -1){
				returnarray.push(fname);
			}else{
				console.log(fname,"not included")
			}
			}
		 })
            // for (var x=0;x<returnarray.length;x++){
                
                // try{
                    // var workflow_folder = path.join(global.api_config["s_SYS_CACHE_DIR"],"../configs/workflows/");
                    // var wf_path = path.join(workflow_folder,returnarray[x]["internal_wf_id"]) + ".json";
                    // //console.log("Reading worfklow for pending ticket: ", wf_path)
                    // var wf_obj = fs.readFileSync(wf_path, 'utf8' ).replace(/^\uFEFF/, '');
                    // wf_obj = JSON.parse(wf_obj);
                    // returnarray[x]["workflow"] = wf_obj["wf_name"];
                    // //console.log("Found workflow name: ", wf_obj["wf_name"])
                    
                // }catch(ex){
                    // console.error("Error reading workflow for pending ticket: ",ex);
                    
                // }
            // }
        
	return [];
}

//all files in all directories to array
function jsonfiles_to_array(dir) {

		if (!dir){return}
		
		var returnarray=[];
		//Array.prototype.concat(fs.readdirSync(dir)).forEach(
        fs.readdirSync(dir).forEach(function(fname){
                var newitem = (JSON.parse(fs.readFileSync(path.join(dir,fname), 'utf8').replace(/^\uFEFF/, '')))//removes BOM	;
                var wf_id =  fname.split("~")[3];
                newitem["fullpath"] = fname;
                newitem["internal_wf_id"] = wf_id;
                returnarray.push(newitem)
            }
            
		);
        
		return returnarray;
			
}
/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
async function start(req, res) {
	try {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
		var s_tick_path = path.join(path.join(global.api_config["s_SYS_CACHE_DIR"],"tickets"),"");
	    var o_return = {};
        o_return["tickets"] = {};
		o_return["tickets"]["running"] = jsonfiles_to_array(path.join(s_tick_path,"running"));
		o_return["tickets"]["queue"] = jsonfiles_to_array(path.join(s_tick_path,"queue"));
		o_return["tickets"]["pending"] = await get_pending();
		
		console.log("pending" ,o_return["tickets"]["pending"])
		res.json(o_return);
		res.end();
	} catch(err) {
		console.debug(err);
		return res.status(500).json({description: err});
	}
}
