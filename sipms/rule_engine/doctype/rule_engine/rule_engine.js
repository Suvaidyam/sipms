// Copyright (c) 2023, suvaidyam and contributors
// For license information, please see license.txt

frappe.ui.form.on("Rule Engine", {
	refresh(frm) {
        frappe.call({
            method: "sipms.rule_engine.apis.get_meta_api.get_field_lists",
            args: {
                doctype_name: "Beneficiary Profiling",
                field_types: ["Date","Int" ]
            },
            callback: function(response) {
                // Handle the response
                if (response.message) {
                    console.log(response.message);
                    frm.fields_dict.field_table.grid.update_docfield_property("field","options", response.message);
                    // Do something with the response data
                } else {
                    console.error("API call failed");
                }
            }});
	},
});
