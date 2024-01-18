// Copyright (c) 2024, suvaidyam and contributors
// For license information, please see license.txt

frappe.ui.form.on("Community meeting", {
	refresh(frm) {

	},
    add_to_beneficary:function(frm){
        frappe.route_options = {
            lead: frm.doc.name,
            date_of_visit: frm.doc.date_of_visit,
            gender: frm.doc.gender,
            completed_age: frm.doc.completed_age,
            name_of_the_beneficiary: frm.doc.name_of_the_beneficiary,
            contact_number: frm.doc.contact_number,
            caste_category: frm.doc.caste_category,
            education: frm.doc.education,
            current_occupation: frm.doc.current_occupation,
            marital_status: frm.doc.marital_status,
            single_window: frm.doc.single_window,
            fathers_name: frm.doc.fathers_name,
            mothers_name: frm.doc.mothers_name,
            source_of_information: frm.doc.source_of_information,
            state_of_origin: frm.doc.state_of_origin,
            current_house_type: frm.doc.current_house_type,
            address: frm.doc.address,
            name_of_scheme: frm.doc.name_of_scheme,
        };
        
        // Open a new form for the desired DocType
        frappe.new_doc('Beneficiary Profiling');
        
    }
});
