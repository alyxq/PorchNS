/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
 define(['N/search'], function(search) {

   function _get(context) {
       log.debug(search)
       var employeeSearchObj = search.create({
         type: "employee",
         filters:
         [
         ],
         columns:
         [
           search.createColumn({
             name: "entityid",
             sort: search.Sort.ASC,
             label: "Name"
           }),
           search.createColumn({name: "email", label: "Email"}),
           search.createColumn({name: "phone", label: "Phone"}),
           search.createColumn({name: "altphone", label: "Office Phone"}),
           search.createColumn({name: "fax", label: "Fax"}),
           search.createColumn({name: "supervisor", label: "Supervisor"}),
           search.createColumn({name: "title", label: "Job Title"}),
           search.createColumn({name: "altemail", label: "Alt. Email"}),
           search.createColumn({name: "giveaccess", label: "Login Access"})
         ]
       });
      var searchResultCount = employeeSearchObj.runPaged().count;
      log.debug("employeeSearchObj result count",searchResultCount);
      employeeSearchObj.run().each(function(result){
         // .run().each has a limit of 4,000 results
         log.debug(result)
         return true;
      });
      return 'thismessage'
   }

   return {
       get: _get,
   }
});