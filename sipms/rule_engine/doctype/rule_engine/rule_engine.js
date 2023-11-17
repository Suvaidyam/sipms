// Copyright (c) 2023, suvaidyam and contributors
// For license information, please see license.txt

function get_field_list(frm){
    frappe.call({
        method: "sipms.rule_engine.apis.get_meta_api.get_field_lists",
        args: {
            doctype_name: "Beneficiary Profiling",
            field_types: ["Date","Int"]
        },
        callback: function(response) {
            // Handle the response
            frm.fields_dict.field_table.grid.update_docfield_property("rule_field","options", response.message);
            if (response.message) {
                console.log(response.message);
            } else {
                console.error("API call failed");
            }
        }});
}

frappe.ui.form.on("Rule Engine", {
	refresh(frm) {

	},
});
// CHILD TABLE 
frappe.ui.form.on('Rule Engine Child', {
    refresh(frm) {
    },
    field_table_add(frm, cdt, cdn) {
    let initial_code = 64
    let row = frappe.get_doc(cdt, cdn);
    if(row.idx <= 26){
        row.code= (String.fromCharCode(initial_code + row.idx))
    }else{
        row.code= (String.fromCharCode(initial_code + (row.idx -26)) + String.fromCharCode(initial_code + (row.idx- 26)))
    }
    
    get_field_list(frm)
    console.log("aa",cur_frm.fields_dict.field_table.grid.toggle_reqd)
    cur_frm.fields_dict.field_table.grid.toggle_reqd("data", 1)
    // console.log(frm.fields_dict.field_table.grid.df.read_only)
    // frm.fields_dict.field_table.grid.df.read_only = 1
    frm.fields_dict.field_table.row.data.df.data = 'Date';
    console.log(frm.fields_dict.field_table.section.fields_dict.field_table)
    // row.data.refresh();
      // set_field_options("specific_support_type", ["Loan Approved","Loan Appealing"])
  
    }
  })
