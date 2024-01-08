// Copyright (c) 2024, suvaidyam and contributors
// For license information, please see license.txt

frappe.ui.form.on("Name of the Department", {
	refresh(frm) {
        frm.add_web_link(frm?.doc?.department_urlwebsite)
	},
    department_urlwebsite: function(frm){
        frm.add_web_link(frm?.doc?.department_urlwebsite)
    }
});
