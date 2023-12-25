// Copyright (c) 2023, suvaidyam and contributors
// For license information, please see license.txt
const dialogsConfig = {
  document_submitted: {
    title: 'Enter details for Support',
    fields: [
      {
        label: 'Date of application',
        fieldname: 'date_of_application',
        fieldtype: 'Date',
        reqd: 1,
        _doc: true
      },
      {
        label: 'Application number',
        fieldname: 'application_number',
        fieldtype: 'Data',
        _doc: true
      },
      {
        label: 'Amount paid',
        fieldname: 'amount_paid',
        fieldtype: 'Int',
        _doc: true
      },
      {
        label: 'Paid by',
        fieldname: 'paid_by',
        fieldtype: 'Select',
        options: ["Self", "CSC"],
        _doc: true
      }
    ]
  },
  document_completed_frm_support: {
    title: 'Enter details for Support',
    fields: [
      {
        label: 'Date of application',
        fieldname: 'date_of_application',
        fieldtype: 'Date',
        reqd: 1,
        _doc: true
      },
      {
        label: 'Date of completion',
        fieldname: 'date_of_completion',
        fieldtype: 'Date',
        reqd: 1,
        _doc: true
      },
      {
        label: 'Application number',
        fieldname: 'application_number',
        fieldtype: 'Data',
        _doc: true
      },
      {
        label: 'Amount paid',
        fieldname: 'amount_paid',
        fieldtype: 'Int',
        _doc: true
      },
      {
        label: 'Paid by',
        fieldname: 'paid_by',
        fieldtype: 'Select',
        options: ["Self", "CSC"],
        _doc: true
      },
      {
        label: 'Completion certificate',
        fieldname: 'completion_certificate',
        fieldtype: 'Attach',
        _doc: true
      }
    ]
  },
  document_completed: {
    title: 'Enter details for Support',
    fields: [
      {
        label: 'Date of completion',
        fieldname: 'date_of_completion',
        fieldtype: 'Date',
        reqd: 1,
        _doc: true
      },
      {
        label: 'Completion certificate',
        fieldname: 'completion_certificate',
        fieldtype: 'Attach',
        _doc: true
      }
    ]
  },
  document_rejected: {
    title: 'Enter details for Support',
    fields: [
      {
        label: 'Date of rejection',
        fieldname: 'date_of_rejection',
        fieldtype: 'Date',
        reqd: 1,
        _doc: true
      },
      {
        label: 'Reason of rejection',
        fieldname: 'reason_of_rejection',
        fieldtype: 'Data',
        reqd: 1,
        _doc: true
      }
    ]
  }
}
const createDialog = (_doc, config) => {
  return new frappe.ui.Dialog({
    title: config.title,
    fields: config.fields,
    size: 'small', // small, large, extra-large
    primary_action_label: 'Save',
    primary_action(obj) {
      let fields = config.fields.filter(f => f._doc).map(e => e.fieldname)
      for (let field of fields) {
        if (obj[field])
          _doc[field] = obj[field]
      }
      this.hide()
    }
  });
}
//  COMMON FUNCTION FOR DEFULT FILTER
function defult_filter(field_name, filter_on, frm) {
  frm.fields_dict[field_name].get_query = function (doc) {
    return {
      filters: {
        [filter_on]: `please select Current ${filter_on}`,
      },
    };
  }
};
var scheme_list = []
function callAPI(options) {
  return new Promise((resolve, reject) => {
    frappe.call({
      ...options,
      callback: async function (response) {
        resolve(response?.message || response?.value)
      }
    });
  })
}
// COMMON FUNCTON FOR FILTER OF LINK FIELD
function apply_filter(field_name, filter_on, frm, filter_value) {
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
function hide_advance_search(frm, list) {
  for (item of list) {
    frm.set_df_property(item, 'only_select', true);
  }
}
frappe.ui.form.on("Beneficiary Profiling", {
  /////////////////  CALL ON SAVE OF DOC OR UPDATE OF DOC ////////////////////////////////
  before_save: function (frm) {
    // check alternate mobile number digits
    if (frm.doc.alternate_contact_number < 4) {
      frm.doc.alternate_contact_number = ''
    }
    if (frm.doc.do_you_have_id_document == "Yes" && frm.doc.id_section?.length == '0') {
      if (!(frm.doc.id_section[0] && frm.doc?.id_section[0]?.select_id != "undefined")) {
        frappe.throw('Please Select Which of the following ID documents do you have?');
      }
      return
    }
    // support status manage
    if (frm.selected_doc.scheme_table) {
      for (support_items of frm.selected_doc.scheme_table) {
        if (support_items.application_submitted == "No") {
          support_items.status = 'Open'
        } else if (support_items.application_submitted == "Yes") {
          support_items.status = 'Under process'
        } else {
          support_items.status = 'Completed'
        }
      }
    }
    // follow up status manage
    if (frm.selected_doc.follow_up_table) {
      for (support_item of frm.selected_doc.scheme_table) {
        if (!['Completed'].includes(support_item.status)) {
          let followups = frm.selected_doc.follow_up_table.filter(f => f.parent_ref == support_item?.name)
          let latestFollowup = followups.length ? followups[(followups.length - 1)] : null
          if (latestFollowup) {
            switch (latestFollowup.follow_up_status) {
              case "Interested":
                support_item.status = "Open"
                break;
              case "Not interested":
                support_item.status = "Closed"
                break;
              case "Rejected":
                support_item.status = "Rejected"
                support_item.date_of_rejection = latestFollowup.date_of_rejection || support_item.date_of_rejection
                support_item.reason_of_rejection = latestFollowup.reason_of_rejection || support_item.reason_of_rejection
                break;
              case "Document submitted":
                support_item.application_submitted = "Yes"
                support_item.status = "Under process"
                support_item.date_of_application = latestFollowup.date_of_application || support_item.date_of_application
                support_item.application_number = latestFollowup.application_number || support_item.application_number
                support_item.amount_paid = latestFollowup.amount_paid || support_item.amount_paid
                support_item.paid_by = latestFollowup.paid_by || support_item.paid_by
                break;
              case "Completed":
                support_item.status = "Completed"
                support_item.date_of_completion = latestFollowup.date_of_completion || support_item.date_of_completion
                support_item.completion_certificate = latestFollowup.completion_certificate || support_item.completion_certificate
                break;
              case "Not reachable":
                support_item.status = support_item?.application_submitted == "Yes" ? "Under process" : "Open"
                if (latestFollowup.to_close_status) {
                  support_item.status = latestFollowup.to_close_status
                  console.log("closed")
                }
                break;
              default:
                support_item.status = "Under process"
                break;
            }
          }
        }
      }

    }

    let open, under_process, form_submitted, rejected, completed, closed;
    open = under_process = form_submitted = rejected = completed = closed = 0;
    let total_no_of_support = 0
    if (frm.selected_doc.scheme_table) {
      for (item of frm.selected_doc.scheme_table) {
        // global_data.push(item)
        ++total_no_of_support
        if (item.status === 'Open') {
          ++open
        } else if (item.status === 'Under process') {
          ++under_process
        } else if (item.status === 'Form submitted') {
          ++form_submitted
        } else if (item.status === 'Rejected') {
          ++rejected
        } else if (item.status === 'Completed') {
          ++completed
        } else {
          ++closed
        }
      }
    }
    let numberic_overall_status = (completed + rejected) + '/' + (completed + rejected + form_submitted + under_process + open)
    frm.doc.numeric_overall_status = numberic_overall_status;
    if (total_no_of_support === open) {
      frm.doc.overall_status = 'Open'
    } else if (total_no_of_support === completed) {
      frm.doc.overall_status = 'Completed'
    } else {
      if (total_no_of_support === open + under_process + form_submitted) {
        frm.doc.overall_status = 'Open'
      } else if (total_no_of_support === completed + closed + rejected) {
        frm.doc.overall_status = 'Completed'
      } else {
        frm.doc.overall_status = 'Partially completed'
      }
    }

  },
  async refresh(frm) {
    frm.doc.name_of_the_concerned_help_desk_member = frappe.session.user
    let sc_list = await callAPI({
      method: 'sipms.api.execute',
      freeze: true,
      args: {
        name: frm.doc.name
      },
      freeze_message: __("Getting schemes..."),
    })
    scheme_list = sc_list.sort((a, b) => b.matching_rules_per - a.matching_rules_per);
    let tableConf = {
      columns: [
        {
          name: "Name",
          id: 'name',
          editable: false,
          resizable: false,
          sortable: false,
          focusable: false,
          dropdown: true,
          width: 200
        },
        {
          name: "Field",
          id: 'rule_field',
          editable: false,
          resizable: false,
          sortable: false,
          focusable: false,
          dropdown: false,
          width: 100
        },
        {
          name: "Operator",
          id: 'operator',
          editable: false,
          resizable: false,
          sortable: false,
          focusable: false,
          dropdown: false,
          width: 100
        },
        {
          name: "Data",
          id: 'data',
          editable: false,
          resizable: false,
          sortable: false,
          focusable: false,
          dropdown: false,
          width: 100
        },
        {
          name: "Check",
          id: 'check',
          editable: false,
          resizable: false,
          sortable: false,
          focusable: false,
          dropdown: false,
          width: 100
        }
      ],
      rows: []
    };
    for (let scheme of scheme_list) {
      let f = true
      for (let rule of scheme.rules) {
        tableConf.rows.push({
          name: f ? scheme.name : undefined,
          ...rule
        })
        f = false
      }
    }
    const container = document.getElementById('all_schemes');
    const datatable = new DataTable(container, { columns: tableConf.columns });
    datatable.refresh(tableConf.rows);

    refresh_field("name_of_the_concerned_help_desk_member")
    // check alternate mobile number digits
    // if(!frm.doc.alternate_contact_number){
    //   frm.doc.alternate_contact_number = '+91-'
    //   refresh_field("alternate_contact_number")
    // }
    // set  defult date of visit
    if (frm.doc.__islocal) {
      frm.set_value('date_of_visit', frappe.datetime.get_today());
    }
    // Hide Advance search options
    hide_advance_search(frm, ["state", "district", "ward", "state_of_origin",
      "district_of_origin", "block", "gender", "caste_category", "religion", "education",
      "current_occupation", "marital_status", "social_vulnerable_category", "pwd_category", "family"])

    // Increase Defult Limit of link field
    frm.set_query("state", () => { return { page_length: 1000 }; });
    frm.set_query("district", () => { return { page_length: 1000 }; });
    frm.set_query("ward", () => { return { page_length: 1000 }; });
    frm.set_query("state_of_origin", () => { return { page_length: 1000 }; });
    frm.set_query("district_of_origin", () => { return { page_length: 1000 }; });
    frm.set_query("block", () => { return { page_length: 1000 }; });

    // Apply defult filter in doctype
    defult_filter('district', "State", frm);
    defult_filter('ward', "District", frm)
    defult_filter('district_of_origin', "State", frm)
    defult_filter('block', "District", frm)
  },
  state: function (frm) {
    apply_filter("district", "State", frm, frm.doc.state)
  },
  district: function (frm) {
    apply_filter("ward", "District", frm, frm.doc.district)
  },
  state_of_origin: function (frm) {
    console.log(frm.doc.state)
    apply_filter("district_of_origin", "State", frm, frm.doc.state_of_origin)
  },
  district_of_origin: function (frm) {
    apply_filter("block", "District", frm, frm.doc.district_of_origin)
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
  same_as_above: function (frm) {
    if (frm.doc.same_as_above == '1') {
      frm.doc.state_of_origin = frm.doc.state;
      frm.doc.district_of_origin = frm.doc.district;
      frm.doc.block = frm.doc.ward;
    } else {
      frm.doc.state_of_origin = '';
      frm.doc.district_of_origin = '';
      frm.doc.block = '';
    }
    frm.refresh()
  }

});
// ********************* Support CHILD Table***********************
frappe.ui.form.on('Scheme Child', {
  scheme_table_add: function (frm, cdt, cdn) {
    // get_milestone_category(frm)
    let row = frappe.get_doc(cdt, cdn);
    console.log(row)
  },
  milestone_category: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    // get_scheme_list(frm, row.milestone_category)

  },
  application_submitted: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.application_submitted == "Yes") {
      row.status = ''
      createDialog(row, dialogsConfig.document_submitted).show();
    } else if (row.application_submitted == "Completed") {
      createDialog(row, dialogsConfig.document_completed_frm_support).show();
    }
  },

})

// ********************* FOLLOW UP CHILD Table***********************

frappe.ui.form.on('Follow Up Child', {
  follow_up_table_add(frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    console.log("kkkk")
    let support_data = frm.doc.scheme_table.filter(f => (f.status != 'Completed' && f.status != 'Rejected' && !f.__islocal)).map(m => m.milestone_category);
    row.follow_up_date = frappe.datetime.get_today()
    frm.fields_dict.follow_up_table.grid.update_docfield_property("name_of_the_scheme", "options", support_data);
  },
  name_of_the_scheme: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    let supports = frm.doc.scheme_table.filter(f => f.specific_support_type == row.support_name);
    let latestSupport = supports.length ? supports[supports.length - 1] : null;
    if (latestSupport) {
      row.parent_ref = latestSupport.name
    }
    for (support_items of frm.doc.scheme_table) {
      if (row.support_name == support_items.specific_support_type) {
        if (support_items.status === "Open" && support_items.application_submitted == "No") {
          frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_with", "options", ["Beneficiary"]);
          row.follow_up_with = "Beneficiary"
          frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_status", "options", ["Interested", "Not interested", "Document submitted", "Not reachable"]);
        } else if (support_items.status === "Under process" && support_items.application_submitted == "Yes") {
          frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_with", "options", ["Beneficiary", "Government department", "Government website", "Others"]);
          frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_status", "options", ["Not reachable", "Under process", "Additional info required", "Completed", "Rejected"]);
        } else if (support_items.status === "Closed" && support_items.application_submitted == "Yes") {
          // last call update  ?? confusion changes
          frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_with", "options", ["Beneficiary", "Government department", "Government website", "Others"]);
          frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_status", "options", ["Not reachable", "Under process", "Additional info required", "Completed", "Rejected"]);
        } else if (support_items.status === "Closed" && support_items.application_submitted == "No") {
          frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_with", "options", ["Beneficiary"]);
          row.follow_up_with = "Beneficiary"
          frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_status", "options", ["Interested", "Not interested", "Document submitted", "Not reachable"]);
        }
      }
    }
  },
  follow_up_with: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    let supports = frm.doc.scheme_table.filter(f => f.specific_support_type == row.support_name);
    let latestSupport = supports.length ? supports[supports.length - 1] : null;
    if (row.follow_up_with != "Beneficiary" && latestSupport.application_submitted == "Yes") {
      frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_status", "options", ["Not reachable", "Under process", "Additional info required", "Completed", "Rejected"]);
    } else if (row.follow_up_with == "Beneficiary" && latestSupport.application_submitted == "Yes") {
      frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_status", "options", ["Not reachable", "Under process", "Additional info required", "Completed", "Rejected"]);
    } else if (row.follow_up_with == "Beneficiary" && latestSupport.application_submitted == "No") {
      frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_status", "options", ["Interested", "Not interested", "Document submitted", "Not reachable"]);
    }
  },
  follow_up_status: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    let supports = frm.doc.scheme_table.filter(f => f.specific_support_type == row.support_name);
    let latestSupport = supports.length ? supports[supports.length - 1] : null;
    if (row.follow_up_status === "Document submitted") {
      createDialog(row, dialogsConfig.document_submitted).show();
    } else if (row.follow_up_status === "Completed") {
      createDialog(row, dialogsConfig.document_completed).show();
    } else if (row.follow_up_status === "Rejected") {
      createDialog(row, dialogsConfig.document_rejected).show();
    } else if (row.follow_up_status === "Not reachable" && latestSupport.status != "Closed") {
      let followups = frm.doc.follow_up_table.filter(f => f.parent_ref == row.parent_ref && f.support_name == row.support_name && f.follow_up_status == "Not reachable")
      if (followups.length >= 2) {
        frappe.warn('Do you want to close the support?',
          `The follow-up status is "Not reachable" ${followups.length} times`,
          () => {
            row.to_close_status = "Closed"
            console.log(row, "row")
          },
          'Close',
          true // Sets dialog as minimizable
        )

      }
      //  show popup and continue and close if more than two times
    }
  }

})
