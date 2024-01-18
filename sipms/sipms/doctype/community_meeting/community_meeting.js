// Copyright (c) 2024, suvaidyam and contributors
// For license information, please see license.txt

frappe.ui.form.on("Community meeting", {
	refresh(frm) {

	},
    add_to_beneficary:function(frm){
        // frappe.new_doc('Beneficiary Profiling', { status: 'Open' })fi
        // frappe.set_route('List', 'Beneficiary Profiling');
        // frappe.set_route(`/beneficiary-profiling/new-beneficiary-profiling/?id=${frm.doc.name_of_the_beneficiary}`)
        // window.print()
        id = frm.doc.name
        // frappe.set_route(['List', 'Beneficiary Profiling', 'Beneficiary Profiling'], { status: 'Open' })
    }
});
