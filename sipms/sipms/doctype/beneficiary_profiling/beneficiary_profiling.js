// Copyright (c) 2023, suvaidyam and contributors
// For license information, please see license.txt
let support__document_sub = []
let document_submitted = new frappe.ui.Dialog({
  title: 'Enter details for Support',
  fields: [
    {
      label: 'Date of application',
      fieldname: 'date_of_application',
      fieldtype: 'Date',
      reqd: 1,
    },
    {
      label: 'Application number',
      fieldname: 'application_number',
      fieldtype: 'Data'
    },
    {
      label: 'Amount paid',
      fieldname: 'amount_paid',
      fieldtype: 'Int'
    },
    {
      label: 'Paid by',
      fieldname: 'paid_by',
      fieldtype: 'Select',
      options: ["Self", "CSC"]
    }
  ],
  size: 'small', // small, large, extra-large
  primary_action_label: 'Save',
  primary_action(values) {
    support__document_sub = values
    document_submitted.hide();
  }
});
let support__document_com = []
let document_completed = new frappe.ui.Dialog({
  title: 'Enter details for Support',
  fields: [
    {
      label: 'Date of completion',
      fieldname: 'date_of_completion',
      fieldtype: 'Date',
      reqd: 1,
    },
    {
      label: 'Completion certificate',
      fieldname: 'completion_certificate',
      fieldtype: 'Attach'
    }
  ],
  size: 'small', // small, large, extra-large
  primary_action_label: 'Save',
  primary_action(values) {
    support__document_com = values
    console.log("save")
    document_completed.hide();
  }
});
let support__document_rej = []
let document_rejected = new frappe.ui.Dialog({
  title: 'Enter details for Support',
  fields: [
    {
      label: 'Date of rejection',
      fieldname: 'date_of_rejection',
      fieldtype: 'Date',
      reqd: 1,
    },
    {
      label: 'Reason of rejection',
      fieldname: 'reason_of_rejection',
      fieldtype: 'Data'
    }
  ],
  size: 'small', // small, large, extra-large
  primary_action_label: 'Save',
  primary_action(values) {
    support__document_rej = values
    console.log("save")
    document_rejected.hide();
  }
});

// API calling for support and 
function get_support_list(frm, support_type) {
  frappe.call({
    method: 'frappe.desk.search.search_link',
    args: {
      doctype: 'Support',
      txt: '',
      filters: [
        ['Support', 'support_type', '=', support_type],
      ],
      page_length: 100,  // Adjust the number of results per page as needed
    },
    freeze: true,
    freeze_message: __("Calling"),
    callback: async function (response) {
      let under_process_completed_ops = frm.doc.support_table.filter(f => (['Under process', 'Open'].includes(f.status))).map(m => m.specific_support_type)
      // console.log("under_process_completed_ops", under_process_completed_ops)
      let ops = response.results.filter(f => !under_process_completed_ops.includes(f.value))
      // console.log(" options", ops)
      frm.fields_dict.support_table.grid.update_docfield_property("specific_support_type", "options", ops);
    }
  });
};

//  COMMON FUNCTION FOR DEFULT FILTER 
function defult_filter(field_name, filter_on , frm){
    frm.fields_dict[field_name].get_query = function (doc) {
        return {
          filters: {
            [filter_on]: `please select Current ${filter_on}`,
          },
        };
      }
};
///// COMMON FUNCTON FOR FILTER OF LINK FIELD
function apply_filter(field_name, filter_on , frm , filter_value){
    frm.fields_dict[field_name].get_query = function (doc) {
        return {
          filters: {
            [filter_on]: filter_value,
          },
          page_length: 1000
        };
      }
};
// ///// Hide Advance search option in Link Fields
function hide_advance_search(frm ,list){
    for(item of list){
        frm.set_df_property(item, 'only_select', true);
    }
}


frappe.ui.form.on("Beneficiary Profiling", {
    /////////////////  CALL ON SAVE OF DOC OR UPDATE OF DOC ////////////////////////////////
    before_save: function(frm){

    },
	refresh(frm) {
        // set  defult date of visit 
        if(frm.doc.__islocal){
            frm.set_value('date_of_visit', frappe.datetime.get_today());
        }
        // Hide Advance search options
        hide_advance_search(frm, ["state","district", "ward", "state_of_origin" ,
        "district_of_origin", "block" , "gender", "caste_category","religion", "education",
        "current_occupation","marital_status","social_vulnerable_category","pwd_category","family"])

        // Increase Defult Limit of link field 
        frm.set_query("state", () => { return { page_length: 1000 };});
        frm.set_query("district", () => { return { page_length: 1000 };});
        frm.set_query("ward", () => { return { page_length: 1000 };});
        frm.set_query("state_of_origin", () => { return { page_length: 1000 };});
        frm.set_query("district_of_origin", () => { return { page_length: 1000 };});
        frm.set_query("block", () => { return { page_length: 1000 };});

        // Apply defult filter in doctype
        defult_filter('district', "State" , frm);
        defult_filter('ward', "District" , frm)
        defult_filter('district_of_origin', "State" , frm)
        defult_filter('block', "District" , frm)
	},
    state:function(frm){
        apply_filter("district","State", frm , frm.doc.state)
    },
    district:function(frm){
        apply_filter("ward","District", frm , frm.doc.district)
    },
    state_of_origin:function(frm){
        console.log(frm.doc.state)
        apply_filter("district_of_origin","State", frm , frm.doc.state_of_origin)
    },
    district_of_origin:function(frm){
        apply_filter("block","District", frm , frm.doc.district_of_origin)
    },
    date_of_birth: function (frm) {
        let dob = frm.doc.date_of_birth
        if (dob) {
          let year = frappe.datetime.get_today()
          let age = year.split('-')[0] - dob.split('-')[0]
          frm.set_value('completed_age', age)
          frm.set_df_property('completed_age', 'read_only', 1);
        } else {
          frm.set_df_property('completed_age', 'read_only', 0);
          frm.set_value('completed_age', null)
        }
      },

});

frappe.ui.form.on('Support Child', {
  support_table_add:function(frm ,  cdt, cdn){
    let row = frappe.get_doc(cdt, cdn);
    get_support_types(frm)
  },
  reason_of_application:function(frm , cdt, cdn){
    let row = frappe.get_doc(cdt, cdn);
    console.log(row)
  }
})
