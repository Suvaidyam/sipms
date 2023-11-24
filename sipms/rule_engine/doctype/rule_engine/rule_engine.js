// Copyright (c) 2023, suvaidyam and contributors
// For license information, please see license.txt
var field_list = []
function get_field_list(frm){
    frappe.call({
        method: "sipms.rule_engine.apis.get_meta_api.get_field_lists",
        args: {
            doctype_name: "Beneficiary Profiling",
            field_types: ["Date","Int", "Link"]
        },
        callback: function(response) {
            // Handle the response
            field_list = response.message
            frm.fields_dict.field_table.grid.update_docfield_property("rule_field","options", response.message);
            if (response.message) {
                console.log(response.message);
            } else {
                console.error("API call failed");
            }
        }});
        
}
function get_Link_list(doctype_name , frm){
    frappe.call({
        method: "frappe.desk.search.search_link",
        args: {
            doctype: doctype_name,
            txt: "",
            page_length: 10000
        },
        callback: function(response) {
            // Handle the response
            frm.fields_dict.field_table.grid.update_docfield_property("select","options", response.results);
            if (response.results) {
                console.log(response.results);
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
    console.log("aa",row)
    // frm.fields_dict.field_table.grid.toggle_reqd("data", 1)
    // console.log(frm.fields_dict.field_table.grid.get_field('rule_field'))
    // frm.fields_dict.field_table.section.fields_dict.field_table.grid.df.fields_dict.rule_field.toggle(false)
    // frm.fields_dict.field_table.grid.df.fields_dict.rule_field.toggle(false);
    // frm.fields_dict.field_table.grid.get_field('rule_field').df.hidden = true;


    // frm.fields_dict.field_table.grid.df.read_only = 1
    // frm.fields_dict.field_table.row.data.df.data = 'Date';
    // console.log(frm.fields_dict.field_table.section.fields_dict.field_table)
   
  
    },
    rule_field: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        row.type= field_list?.find(f => f.value == row.rule_field)?.type;
        if(row.type == "Link"){
            frm.fields_dict.field_table.grid.update_docfield_property("operator","options", ["=", "!=", "IN","NOT IN"]);
            get_Link_list(field_list.find(f => f.value == row.rule_field)?.options , frm)
        }else{
            frm.fields_dict.field_table.grid.update_docfield_property("operator","options", ["=", "!=",">","<",">=","<=", "IN","NOT IN"]);
        }
        frm.fields_dict.field_table.grid.refresh();
        console.log( );
        console.log(row.rule_field)

        var cur_grid =frm.get_field('field_table').grid;
var cur_doc = locals[cdt][cdn];
var cur_row = cur_grid.get_row(cur_doc.name);
cur_row.toggle_view();
    },
    date:function(frm , cdt , cdn){
        let row = frappe.get_doc(cdt, cdn);
        row.data = row.date
        frm.fields_dict.field_table.grid.refresh();
    },
    select:function(frm , cdt, cdn){
        let row = frappe.get_doc(cdt, cdn);
        row.data = row.select
        frm.fields_dict.field_table.grid.refresh();
    },
    value:function(frm , cdt , cdn){
        let row = frappe.get_doc(cdt, cdn);
        row.data = row.value
        frm.fields_dict.field_table.grid.refresh();
    }
  })
