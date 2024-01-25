// Copyright (c) 2023, suvaidyam and contributors
// For license information, please see license.txt
let _frm;
// global variable
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
        label: 'Mode of application',
        fieldname: 'mode_of_application',
        fieldtype: 'Select',
        reqd: 1,
        options: ["Online", "Offline"],
        _doc: true
      },
      {
        label: 'Reason of application',
        fieldname: 'reason_of_application',
        fieldtype: 'Data',
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
        label: 'Remarks',
        fieldname: 'remarks',
        fieldtype: 'Data',
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
        label: 'Mode of application',
        fieldname: 'mode_of_application',
        fieldtype: 'Select',
        reqd: 1,
        options: ["Online", "Offline"],
        _doc: true
      },
      {
        label: 'Reason of application',
        fieldname: 'reason_of_application',
        fieldtype: 'Data',
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
      },
      {
        label: 'Remarks',
        fieldname: 'remarks',
        fieldtype: 'Data',
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
      },
      {
        label: 'Remarks',
        fieldname: 'remarks',
        fieldtype: 'Data',
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
      },
      {
        label: 'Remarks',
        fieldname: 'remarks',
        fieldtype: 'Data',
        _doc: true
      }
    ]
  }
}
const doc_submitted_validate = (_doc) => {
  if (_doc.date_of_application < _frm.date_of_visit) {
    _doc.date_of_application = ''
    return {
      status: false,
      message: "Date of application should not be less than date of visit",
      // date_of_application: ''
    }
  } else if (_doc.date_of_application > frappe.datetime.get_today()) {
    _doc.date_of_application = ''
    return {
      status: false,
      message: "Date of application should not be greater than today date"
    }
  } else {
    return {
      status: true,
      // message:"Invalid "
    }
  }
}
const doc_rejected_validate = (_doc) => {
  if (_doc.date_of_rejection < _frm.date_of_visit) {
    _doc.date_of_rejection = ''
    refresh_field("date_of_rejection")
    return {
      status: false,
      message: "Date of rejection should not be less than date of visit"
    }
  } else if (_doc.date_of_rejection < _doc.date_of_application) {
    _doc.date_of_rejection = ''
    refresh_field("date_of_rejection")
    return {
      status: false,
      message: "Date of rejection should not be less than date of application"
    }
  } else if (_doc.date_of_rejection > frappe.datetime.get_today()) {
    _doc.date_of_rejection = ''
    refresh_field("date_of_rejection")
    return {
      status: false,
      message: "Date of rejection should not be greater than today date"
    }
  } else {
    return {
      status: true,
      // message:"Invalid "
    }
  }
}
const date_of_complete_validate = (_doc) => {
  if (_doc.date_of_application < _frm.date_of_visit) {
    _doc.date_of_application = ''
    return {
      status: false,
      message: "Date of application should not be less than date of visit"

    }
  } else if (_doc.date_of_completion < _frm.date_of_visit) {
    _doc.date_of_completion = ''
    return {
      status: false,
      message: "Date of completion should not be less than date of visit"
    }
  } else if (_doc.date_of_completion > frappe.datetime.get_today()) {
    _doc.date_of_completion = ''
    return {
      status: false,
      message: "Date of completion should not be greater than today date"
    }
  } else if (_doc.date_of_completion < _doc.date_of_application) {
    _doc.date_of_completion = ''
    return {
      status: false,
      message: "Date of completion should not be greater than date date of application"
    }
  } else {
    return {
      status: true,
      // message:"Invalid "
    }
  }
}
const createDialog = (_doc, config, validator = null) => {
  return new frappe.ui.Dialog({
    title: config.title,
    fields: config.fields,
    size: 'small', // small, large, extra-large
    primary_action_label: 'Save',
    primary_action(obj) {
      if (validator) {
        let valid = validator(obj)
        if (!valid.status) {
          return frappe.throw(valid.message);
        }
      }
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
        [filter_on]: frm.doc.filter_on || `please select ${filter_on}`,
      },
    };
  }
};
function extend_options_length(frm, fields) {
  fields.forEach((field) => {
    frm.set_query(field, () => {
      return { page_length: 1000 };
    });
  })
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
const showRules = (row) => {
  let rules = (row?.rules || []).map(e => `${e.rule_field} ${e.operator} ${e.data} ${e.check}`).join("\n")
  frappe.msgprint({
    title: __('rules'),
    message: rules,
    primary_action: {
      action(values) {
        console.log(values);
      }
    }
  });
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
};
const get_ordered_list = async (doctype, optionsToSort) => {
  let list = await callAPI({
    method: 'frappe.desk.search.search_link',
    freeze: true,
    args: {
      doctype: doctype,
      page_length: 1000,
      txt: ''
    },
    freeze_message: __("Getting list ..."),
  })
  if (optionsToSort) {
    let reOrderedList = [];
    optionsToSort.forEach(async (option) => {
      const requiredOption = await list.find(item => item.value === option);
      reOrderedList.push(requiredOption);
    });
    const exceptionList = await list.filter(item => !optionsToSort.some(item2 => item.value === item2));
    exceptionList.forEach(async (option) => {
      reOrderedList = [...reOrderedList, option];
    })
    list = reOrderedList;
    return list;
    // const otherOption = list.find(item => item.value === 'Others');
    // if (otherOption) {
    //   list = list.filter(item => item.value !== 'Others');
    //   list.push(otherOption);
    // }
  }
  return list

}
const get_scheme_list = async (frm) => {
  let list = await callAPI({
    method: 'sipms.api.execute',
    freeze: true,
    args: {
      name: frm.doc.name
    },
    freeze_message: __("Getting schemes..."),
  })
  scheme_list = list.sort((a, b) => b.matching_rules_per - a.matching_rules_per);
  return scheme_list
}


const get_lead_date = async (lead_id, frm) => {
  var fieldsToFetch = ["completed_age", "contact_number"];

  const bulk_refresh_field = async (fields = []) => {
    for (var i = 0; i < fields.length; i++) {
      refresh_field(fields[i])
    }
  }
  // Fetch document with name 'your_document_name' from DocType 'YourDocType'
  frappe.call({
    method: 'frappe.client.get',
    args: {
      doctype: 'Community meeting',
      name: lead_id,
      fields: fieldsToFetch
    },
    callback: function (response) {
      // Handle the response
      if (!response.exc) {
        var doc = response.message;
        console.log('Fetched Document:', doc);
        frm.doc.completed_age = doc.completed_age,
          frm.doc.contact_number = doc.contact_number,
          // frm.doc.date_of_visit = doc.date_of_visit,
          frm.doc.gender = doc.gender,
          frm.doc.name_of_the_beneficiary = doc.name_of_the_beneficiary,
          frm.doc.caste_category = doc.caste_category,
          frm.doc.education = doc.education,
          frm.doc.current_occupation = doc.current_occupation,
          frm.doc.marital_status = doc.marital_status,
          frm.doc.spouses_name = doc.spouses_name,
          frm.doc.single_window = doc.single_window,
          frm.doc.fathers_name = doc.fathers_name,
          frm.doc.mothers_name = doc.mothers_name,
          frm.doc.source_of_information = doc.source_of_information,
          frm.doc.name_of_the_camp = doc.name_of_the_camp
        frm.doc.state_of_origin = doc.state_of_origin,
          frm.doc.current_house_type = doc.current_house_type,
          frm.doc.current_house_type = doc.current_house_type,
          frm.doc.help_desk = doc.help_desk
        frm.doc.occupational_category = doc.occupational_category
        // frm.doc.address = frm.doc.address,
        // frm.doc.name_of_scheme= doc.name_of_scheme,
        bulk_refresh_field(["completed_age", "contact_number", "gender", "name_of_the_beneficiary"
          , "caste_category", "education", "current_occupation", "occupational_category", "marital_status", "single_window", "fathers_name", "mothers_name",
          "source_of_information", "state_of_origin", "current_house_type", "name_of_the_camp"
        ])
        // refresh_field("completed_age")
        // refresh_field("contact_number")


        // Now you can access the specific fields, e.g., doc.field1, doc.field2, etc.
      } else {
        console.error('Error fetching document:', response.exc);
      }
    }
  });

}
frappe.ui.form.on("Beneficiary Profiling", {
  /////////////////  CALL ON SAVE OF DOC OR UPDATE OF DOC ////////////////////////////////
  before_save: function (frm) {
    // fill into hidden fields
    if (frm.doc?.scheme_table && frm.doc?.scheme_table?.length) {
      for (_doc of frm.doc.scheme_table) {
        _doc.scheme = _doc.name_of_the_scheme;
        _doc.milestone = _doc.milestone_category;
      }
    }
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
          if (support_items.status != 'Closed') {
            support_items.status = 'Open'
          }
        } else if (support_items.application_submitted == "Yes") {
          if (support_items.status != 'Closed') {
            support_items.status = 'Under process'
          }
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
          if (latestFollowup?.parent_ref == support_item.name) {
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
                support_item.mode_of_application = latestFollowup.mode_of_application || support_item.mode_of_application
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
                if (support_item.status != "Closed") {
                  if (latestFollowup.to_close_status) {
                    support_item.status = latestFollowup.to_close_status
                  } 
                  // else {
                    // support_item.status = support_item?.application_submitted == "Yes" ? "Under process" : "Open"
                  // }
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
    _frm = frm.doc
    if (frm.doc.lead && frm.doc.__islocal) {
      get_lead_date(frm.doc.lead, frm)
    }
    // set dropdown value by ordering
    frm.set_df_property('current_house_type', 'options', await get_ordered_list("House Types", ["Own", "Rented", "Relative's home", "Government quarter", "Others"]));

    // hide delete options for helpdesk and csc member
    apply_filter('select_primary_member', 'name_of_head_of_family', frm, ['!=', frm.doc.name])
    if (frappe.user_roles.includes("Help-desk member") || frappe.user_roles.includes("CSC Member")) {
      if (!frappe.user_roles.includes("Administrator")) {
        frm.set_df_property('scheme_table', 'cannot_delete_rows', true); // Hide delete button
        frm.set_df_property('scheme_table', 'cannot_delete_all_rows', true);
        frm.set_df_property('follow_up_table', 'cannot_delete_rows', true); // Hide delete button
        frm.set_df_property('follow_up_table', 'cannot_delete_all_rows', true);
      }
    }

    extend_options_length(frm, ["single_window", "help_desk",
      "source_of_information", "current_house_type", "state", "district",
      "education", "ward", "name_of_the_settlement", "proof_of_disability", "block", "state_of_origin", "current_occupation","district_of_origin", "social_vulnerable_category", "name_of_the_camp"])
    frm.set_query('religion', () => {
      return {
        order_by: 'religion.religion ASC'
      };
    });
    scheme_list = await get_scheme_list(frm)
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
          width: 600
        },
        {
          name: "Matches",
          id: 'name',
          editable: false,
          resizable: false,
          sortable: false,
          focusable: false,
          dropdown: false,
          width: 200,
          format: (value, columns, ops, row) => {
            let rules = row?.rules?.map(e => `[${e.rule_field} ${e.operator} ${e.data}] ${e.check ? '&#x2714;' : '&#10060;'}`).join("\n").toString()
            return `<p title='${rules}'>${row?.matches?.bold()}</p>`
          }
        }
      ],
      rows: []
    };
    for (let scheme of scheme_list) {
      tableConf.rows.push({
        name: scheme.name,
        matches: `<a href="/app/scheme/${scheme.name}">${scheme.matching_rules}/${scheme.total_rules}</a>`,
        rules: scheme.rules
      })
    }
    console.log("tableConf", tableConf)
    const container = document.getElementById('all_schemes');
    const datatable = new DataTable(container, { columns: tableConf.columns });
    datatable.style.setStyle(`.dt-scrollable`, { height: '300px!important', overflow: 'scroll!important' });
    datatable.refresh(tableConf.rows);
    // if not is local
    if (frm.doc.__islocal) {
      frm.doc.added_by = frappe.session.user
      refresh_field("added_by")
    }

    // set  defult date of visit
    if (frm.doc.__islocal) {
      frm.set_value('date_of_visit', frappe.datetime.get_today());
    }
    // Hide Advance search options
    hide_advance_search(frm, ["state", "district", "ward", "state_of_origin",
      "district_of_origin", "block", "gender",
     ,"social_vulnerable_category", "pwd_category", "family",
      "help_desk", "single_window", "source_of_information",
      "current_house_type", "name_of_the_settlement", "name_of_the_camp" ,"proof_of_disability"
    ])

    // Increase Defult Limit of link field
    // frm.set_query("state", () => { return { page_length: 1000 }; });
    // frm.set_query("district", () => { return { page_length: 1000 }; });
    // frm.set_query("ward", () => { return { page_length: 1000 }; });
    // frm.set_query("state_of_origin", () => { return { page_length: 1000 }; });
    // frm.set_query("district_of_origin", () => { return { page_length: 1000 }; });
    // frm.set_query("block", () => { return { page_length: 1000 }; });

    // Apply defult filter in doctype
    frm.doc.state ? apply_filter("district", "State", frm, frm.doc.state) : defult_filter('district', "State", frm);
    frm.doc.district ? apply_filter("ward", "District", frm, frm.doc.district) : defult_filter('ward', "District", frm);
    frm.doc.ward ? apply_filter("name_of_the_settlement", "block", frm, frm.doc.ward) : defult_filter('name_of_the_settlement', "Block", frm);
    frm.doc.state_of_origin ? apply_filter("district_of_origin", "State", frm, frm.doc.state_of_origin) : defult_filter('block', "District", frm);
    frm.doc.district_of_origin ? apply_filter("block", "District", frm, frm.doc.district_of_origin) : defult_filter('district_of_origin', "State", frm);
    if (frappe.user_roles.includes("Admin")) {
      frm.doc.single_window ? apply_filter("help_desk", "single_window", frm, frm.doc.single_window) : defult_filter('help_desk', "single_window", frm);
    }
  },
  validate(frm) {
    console.log("validate:", frm.doc);
  },
  ////////////////////DATE VALIDATION/////////////////////////////////////////
  date_of_visit: function (frm) {
    if (new Date(frm.doc.date_of_visit) > new Date(frappe.datetime.get_today())) {
      frm.doc.date_of_visit = ''
      refresh_field('date_of_visit')
      frappe.throw("Date of visit can't be greater than today's date")
    }
  },

  state: function (frm) {
    apply_filter("district", "State", frm, frm.doc.state)
  },
  district: function (frm) {
    apply_filter("ward", "District", frm, frm.doc.district)
  },
  ward: function (frm) {
    apply_filter("name_of_the_settlement", "block", frm, frm.doc.ward)
  },
  state_of_origin: function (frm) {
    apply_filter("district_of_origin", "State", frm, frm.doc.state_of_origin)
  },
  district_of_origin: function (frm) {
    apply_filter("block", "District", frm, frm.doc.district_of_origin)
  },
  single_window: function (frm) {
    apply_filter("help_desk", "single_window", frm, frm.doc.single_window)
  },
  current_occupation: function (frm) {
    refresh_field('occupational_category')
    // console.log("frm")
    // frm.fields_dict['current_occupation'].get_query = function(doc) {
    //   return {
    //     // query: 'sipms.api.occupation',
    //     order_by: 'occupation DESC'  
    //   };
    // };
  },

  date_of_birth: function (frm) {
    let dob = frm.doc.date_of_birth;
    if (new Date(dob) > new Date(frappe.datetime.get_today())) {
      frm.doc.date_of_birth = ''
      refresh_field('date_of_birth')
      frappe.throw("Date of birth can't be greater than today's date")
    }
    if (dob) {
      let today = frappe.datetime.get_today();
      let birthDate = new Date(dob);
      let currentDate = new Date(today);
      let years = currentDate.getFullYear() - birthDate.getFullYear();
      let months = currentDate.getMonth() - birthDate.getMonth();
      console.log("currentDate.getMonth()", currentDate.getMonth() , "birthDate.getMonth();", birthDate.getMonth())
      if (months < 0 || (months === 0 && currentDate.getDate() < birthDate.getDate())) {
        years--;
      }
      var month = (currentDate.getFullYear() - birthDate.getFullYear()) * 12 + (currentDate.getMonth() - birthDate.getMonth());
      if (currentDate.getDate() < birthDate.getDate()) {
          month--;
      }
      if(month <= 11){
        frm.set_value('completed_age_month', month);
      }else{
        frm.set_value('completed_age_month', '');
      }
      let ageString = 0;
      if (years > 0) {
        ageString += years;
        
      }
      frm.set_value('completed_age', ageString);
      frm.set_df_property('completed_age', 'read_only', 1);
    } else {
      frm.set_df_property('completed_age', 'read_only', 0);
      frm.set_value('completed_age', 0);
    }
  },
  completed_age_month: function(frm){
    if (frm.doc.completed_age_month > 11) {
      frm.doc.completed_age_month = ''
      refresh_field('completed_age_month')
      frappe.throw("Completed age in month should be less than or equal to 11")
    }
  },
  are_you_a_person_with_disability_pwd:function(frm){
    if(frm.doc.are_you_a_person_with_disability_pwd =="No"){
      console.log("sss")
      frm.doc.proof_of_disability =[];
      frm.doc.what_is_the_extent_of_your_disability='';
      frm.refresh_fields('proof_of_disability')
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
    refresh_field("state_of_origin")
    refresh_field("district_of_origin")
    refresh_field("block")
  }

});
// ********************* Support CHILD Table***********************
frappe.ui.form.on('Scheme Child', {
  form_render: async function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.application_submitted == 'Yes' && (!row.date_of_application || !row.mode_of_application)) {
      row.status = ''
      createDialog(row, dialogsConfig.document_submitted, doc_submitted_validate).show();
    }else if(row.application_submitted == 'Completed' &&  (!row.date_of_application || !row.mode_of_application)){
      createDialog(row, dialogsConfig.document_completed_frm_support, date_of_complete_validate).show();
    }
  },
  scheme_table_add: async function (frm, cdt, cdn) {
    // get_milestone_category(frm)
    let schemes_op = frm.doc.scheme_table.filter(f => ['Open', 'Under Process', 'Closed'].includes(f.status)).map(e => e.name_of_the_scheme);
    let fl_schemes_ops = scheme_list.filter(f => !schemes_op.includes(f.name))
    let milestones = {};
    let ops = fl_schemes_ops.map(e => {
      milestones.hasOwnProperty(e.milestone) ? '' : milestones[e.milestone] = e.milestone
      return { 'lable': e.name, "value": e.name }
    })

    frm.fields_dict.scheme_table.grid.update_docfield_property("name_of_the_scheme", "options", ops);
    frm.fields_dict.scheme_table.grid.update_docfield_property("milestone_category", "options", Object.keys(milestones).map(e => { return { 'lable': milestones[e], "value": milestones[e] } }));
  },
  name_of_the_scheme: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    row.milestone_category = ''
    let scheme = scheme_list.find(f => row.name_of_the_scheme == f.name)

    if (scheme) {
      row.milestone_category = scheme.milestone;
      // row.mode_of_application = scheme.mode_of_application;
      row.name_of_the_department = scheme.name_of_department;
    }
    refresh_field("scheme_table")
  },
  milestone_category: (frm, cdt, cdn) => {
    let row = frappe.get_doc(cdt, cdn);
    row.name_of_the_scheme = ''
    let schemes = scheme_list.filter(f => row.milestone_category == f.milestone)
    let schemes_op = frm.doc.scheme_table.filter(f => ['Open', 'Under Process', 'Closed'].includes(f.status)).map(e => e.name_of_the_scheme);
    let ops = schemes.filter(f => !schemes_op.includes(f.name)).map(e => { return { 'lable': e.name, "value": e.name } })
    frm.fields_dict.scheme_table.grid.update_docfield_property("name_of_the_scheme", "options", ops);
  },
  application_submitted: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.application_submitted == "Yes") {
      row.status = '';row.date_of_completion='';
      frm.refresh_fields('status', 'date_of_completion')
      createDialog(row, dialogsConfig.document_submitted, doc_submitted_validate).show();
    } else if (row.application_submitted == "Completed") {
      createDialog(row, dialogsConfig.document_completed_frm_support, date_of_complete_validate).show();
    }else if (row.application_submitted == "No"){
      row.date_of_application = '';row.date_of_completion = ''; row.application_number='';row.amount_paid='';row.paid_by=""; 
      frm.refresh_fields("date_of_application","date_of_completion", "application_number" , "amount_paid", "paid_by");
    }
  },

})

// ********************* FOLLOW UP CHILD Table***********************

frappe.ui.form.on('Follow Up Child', {
  form_render: async function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.follow_up_status == 'Document submitted' && (!row.date_of_application || !row.mode_of_application)) {
      row.status = ''
      createDialog(row, dialogsConfig.document_submitted, doc_submitted_validate).show();
    }else if(row.follow_up_status == 'Completed' &&  !row.date_of_completion){
      createDialog(row, dialogsConfig.document_completed, date_of_complete_validate).show();
    }else if (row.follow_up_status == 'Rejected' &&  (!row.date_of_rejection || !row.reason_of_rejection)){
      createDialog(row, dialogsConfig.document_rejected, doc_rejected_validate).show();
    }
    // reject same logic hear
  },
  follow_up_table_add(frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    row.follow = frappe.session.user_fullname
    let support_data = frm.doc.scheme_table.filter(f => (f.status != 'Completed' && f.status != 'Rejected' && !f.__islocal)).map(m => m.name_of_the_scheme);
    row.follow_up_date = frappe.datetime.get_today()
    frm.fields_dict.follow_up_table.grid.update_docfield_property("name_of_the_scheme", "options", support_data);
  },
  name_of_the_scheme: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    let supports = frm.doc.scheme_table.filter(f => f.scheme == row.name_of_the_scheme);
    row.date_of_application = supports[0].date_of_application
    // console.log(supports, "supports")
    // console.log(row, "row")
    row.parent_ref = supports[0].name
    for (support_items of frm.doc.scheme_table) {
      if (row.name_of_the_scheme == support_items.name_of_the_scheme) {
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
  follow_up_date: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.follow_up_date > frappe.datetime.get_today()) {
      row.follow_up_date = null
      frappe.throw(__("You can not select future date in Follow-up date"));
    }
    if (row.follow_up_date < row.date_of_application) {
      row.follow_up_date = null
      frappe.throw(__("Follow-up date should not be less than date of application"));
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
      createDialog(row, dialogsConfig.document_submitted, doc_submitted_validate).show();
    } else if (row.follow_up_status === "Completed") {
      createDialog(row, dialogsConfig.document_completed, date_of_complete_validate).show();
    } else if (row.follow_up_status === "Rejected") {
      createDialog(row, dialogsConfig.document_rejected, doc_rejected_validate).show();
    } else if (row.follow_up_status === "Not reachable" && latestSupport.status != "Closed") {
      let followups = frm.doc.follow_up_table.filter(f => f.parent_ref == row.parent_ref && f.support_name == row.support_name && f.follow_up_status == "Not reachable")
      if (followups.length >= 2) {
        frappe.warn('Do you want to close the scheme?',
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
