// Copyright (c) 2023, suvaidyam and contributors
// For license information, please see license.txt
frappe.ui.form.on("Beneficiary Profiling", {
  refresh: (frm) => {
    let link_fields = frm.meta.fields.filter(f => ['Link'].includes(f.fieldtype)).map(e => {
      return {
        fieldname: e.fieldname,
        fieldtype: e.fieldtype,
        label: e.label,
        options: e.options
      }
    })
    console.log('Upper', link_fields);
  }
})

let _frm;
let global_frm;
// global variable
const dialogsConfig = {
  document_submitted: {
    title: __('Enter details for Support'),
    fields: [
      {
        label: __('Date of application'),
        fieldname: 'date_of_application',
        fieldtype: 'Date',
        reqd: 1,
        _doc: true
      },
      {
        label: __('Mode of application'),
        fieldname: 'mode_of_application',
        fieldtype: 'Select',
        reqd: 1,
        options: [__("Online"), __("Offline")],
        _doc: true
      },
      {
        label: __('Reason of application'),
        fieldname: 'reason_of_application',
        fieldtype: 'Data',
        _doc: true
      },
      {
        label: __('Application number'),
        fieldname: 'application_number',
        fieldtype: 'Data',
        _doc: true
      },
      {
        label: __('Amount paid'),
        fieldname: 'amount_paid',
        fieldtype: 'Int',
        _doc: true
      },
      {
        label: __('Paid by'),
        fieldname: 'paid_by',
        fieldtype: 'Select',
        options: [__("Self"), __("CSC")],
        _doc: true
      },
      {
        label: __('Remarks'),
        fieldname: 'remarks',
        fieldtype: 'Data',
        _doc: true
      }
    ]
  },

  document_completed_frm_support: {
    title: __('Enter details for Support'),
    fields: [
      {
        label: __('Date of application'),
        fieldname: 'date_of_application',
        fieldtype: 'Date',
        reqd: 1,
        _doc: true
      },
      {
        label: __('Date of completion'),
        fieldname: 'date_of_completion',
        fieldtype: 'Date',
        reqd: 1,
        _doc: true
      },
      {
        label: __('Mode of application'),
        fieldname: 'mode_of_application',
        fieldtype: 'Select',
        reqd: 1,
        options: [__("Online"), __("Offline")],
        _doc: true
      },
      {
        label: __('Reason of application'),
        fieldname: 'reason_of_application',
        fieldtype: 'Data',
        _doc: true
      },
      {
        label: __('Application number'),
        fieldname: 'application_number',
        fieldtype: 'Data',
        _doc: true
      },
      {
        label: __('Amount paid'),
        fieldname: 'amount_paid',
        fieldtype: 'Int',
        _doc: true
      },
      {
        label: __('Paid by'),
        fieldname: 'paid_by',
        fieldtype: 'Select',
        options: [__("Self"), __("CSC")],
        _doc: true
      },
      {
        label: __('Completion certificate'),
        fieldname: 'completion_certificate',
        fieldtype: 'Attach',
        _doc: true
      },
      {
        label: __('Remarks'),
        fieldname: 'remarks',
        fieldtype: 'Data',
        _doc: true
      }
    ]
  },
  document_completed: {
    title: __('Enter details for Support'),
    fields: [
      {
        label: __('Date of completion'),
        fieldname: 'date_of_completion',
        fieldtype: 'Date',
        reqd: 1,
        _doc: true
      },
      {
        label: __('Completion certificate'),
        fieldname: 'completion_certificate',
        fieldtype: 'Attach',
        _doc: true
      },
      {
        label: __('Remarks'),
        fieldname: 'remarks',
        fieldtype: 'Data',
        _doc: true
      }
    ]
  },
  document_rejected: {
    title: __('Enter details for Support'),
    fields: [
      {
        label: __('Date of rejection'),
        fieldname: 'date_of_rejection',
        fieldtype: 'Date',
        reqd: 1,
        _doc: true
      },
      {
        label: __('Reason of rejection'),
        fieldname: 'reason_of_rejection',
        fieldtype: 'Data',
        reqd: 1,
        _doc: true
      },
      {
        label: __('Remarks'),
        fieldname: 'remarks',
        fieldtype: 'Data',
        _doc: true
      }
    ]
  }
}
const doc_submitted_validate = (_doc, _scheme) => {
  if (_doc.date_of_application < _frm.doc.date_of_visit) {
    return {
      status: false,
      message: __("Date of application should not be less than date of visit"),
    }
  } else if (_doc.date_of_application > frappe.datetime.get_today()) {
    return {
      status: false,
      message: __("Date of application should not be greater than today date")
    }
  } else {
    return {
      status: true,
      // message:"Invalid "
    }
  }
}
const doc_rejected_validate = (_doc, _scheme) => {
  if (_doc.date_of_rejection < _frm.doc.date_of_visit) {
    return {
      status: false,
      message: __("Date of visit should not be less than date of visit")
    }
  } else if (_doc.date_of_rejection < _scheme.date_of_application) {
    return {
      status: false,
      message: __("Date of rejection should not be less than date of application")
    }
  } else if (_doc.date_of_rejection > frappe.datetime.get_today()) {
    return {
      status: false,
      message: __("Date of rejection should not be greater than today date")
    }
  } else {
    return {
      status: true,
      // message:"Invalid "
    }
  }
}
const date_of_complete_validate = (_doc, _scheme) => {
  console.log(_doc, _scheme)
  if (_doc.date_of_application < _frm.doc.date_of_visit) {
    return {
      status: false,
      message: __("Date of application should not be less than date of visit")

    }
  } else if (_doc.date_of_completion < _frm.doc.date_of_visit) {
    return {
      status: false,
      message: __("Date of completion should not be less than date of visit")
    }
  } else if (_doc.date_of_completion > frappe.datetime.get_today()) {
    return {
      status: false,
      message: __("Date of completion should not be greater than today date")
    }
  } else if ((_doc.date_of_completion < _doc.date_of_application) || (_doc.date_of_completion < _scheme?.date_of_application)) {
    return {
      status: false,
      message: __("Date of completion should not be less than Date of Application")
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
        let valid = validator(obj, _doc)
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
// generate date of birth
function generateDOBFromAge(ageInYears = 0, ageInMonths = 0) {
  // date of birth of tommorow is not selected in calander
  let currentDate = new Date();
  let startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  let birthYear = startOfMonth.getFullYear() - ageInYears;
  let birthMonth = startOfMonth.getMonth() - ageInMonths;
  if (birthMonth < 0) {
    birthYear--;
    birthMonth = 12 + birthMonth;
  }
  // Create the Date object for the generated date of birth
  let generatedDOB = new Date(birthYear, birthMonth, startOfMonth.getDate());
  return generatedDOB;
}
function extend_options_length(frm, fields) {
  fields?.forEach((field) => {
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
function apply_filter(field_name, filter_on, frm, filter_value, withoutFilter = false) {
  frm.fields_dict[field_name].get_query = () => {
    if (withoutFilter) {
      return {
        filters: {},
        page_length: 1000
      };
    }
    return {
      filters: {
        [filter_on]: filter_value || frm.doc[filter_on] || `please select ${filter_on}`,
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
// const get_helpdesk= async(){
//   let list = await callAPI({
//     method: 'frappe.desk.search.search_link',
//     freeze: true,
//     args: {
//       doctype: doctype,
//       page_length: 1000,
//       txt: ''
//     },
//     freeze_message: __("Getting list ..."),
//   })
// }
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
    optionsToSort?.forEach(async (option) => {
      const requiredOption = await list?.find(item => item.value === option);
      reOrderedList.push(requiredOption);
    });
    const exceptionList = await list?.filter(item => !optionsToSort.some(item2 => item.value === item2));
    exceptionList?.forEach(async (option) => {
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
const get_occupation_category = async (frm) => {
  let list = await callAPI({
    method: 'frappe.client.get',
    freeze: true,
    args: {
      doctype: 'Occupation',
      name: frm.doc.current_occupation
    },
    freeze_message: __("Getting schemes..."),
  })
  return list;
}

const get_lead_date = async (lead_id, frm) => {
  var fieldsToFetch = ["completed_age", "contact_number"];
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
        frm.refresh_fields(["completed_age", "contact_number", "gender", "name_of_the_beneficiary"
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
const apply_filter_on_id_document = async () => {
  //  APPLY Filter in ID DOCUMENT
  var child_table = _frm.fields_dict['id_table_list'].grid;
  if (child_table) {
    try {
      child_table.get_field('which_of_the_following_id_documents_do_you_have').get_query = function () {
        return {
          filters: [
            ['ID Document', 'document', 'NOT IN', cur_frm.doc.id_table_list.map(function (item) {
              return item.which_of_the_following_id_documents_do_you_have;
            })]
          ]
        };
      };
    } catch (error) {
      console.error(error)
    }
  }
}
frappe.ui.form.on("Beneficiary Profiling", {
  /////////////////  CALL ON SAVE OF DOC OR UPDATE OF DOC ////////////////////////////////
  before_save: async function (frm) {
    if (frm.doc.completed_age || frm.doc.completed_age_month) {
      await frm.set_value("date_of_birth", generateDOBFromAge(frm.doc?.completed_age, frm.doc?.completed_age_month))
    }
    // fill into hidden fields
    if (frm.doc?.scheme_table && frm.doc?.scheme_table?.length) {
      for (_doc of frm.doc.scheme_table) {
        _doc.scheme = _doc.name_of_the_scheme;
        _doc.milestone = _doc.milestone_category;
      }
    }
    // check alternate mobile number digits
    if (frm.doc.alternate_contact_number == "+91-") {
      frm.set_value("alternate_contact_number", '')
    }
    if (frm.doc.do_you_have_id_document == "Yes" && frm.doc.id_section?.length == '0') {
      if (!(frm.doc.id_section[0] && frm.doc?.id_section[0]?.select_id != "undefined")) {
        frappe.throw(__('Please Select Which of the following ID documents do you have?'));
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
        if (!['Completed', 'Previously availed'].includes(support_item.status)) {
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
        } else if (item.status === 'Completed' || item.status === 'Previously availed') {
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
    _frm = frm
    if (frm.doc.lead && frm.doc.__islocal) {
      get_lead_date(frm.doc.lead, frm)
    }
    apply_filter_on_id_document()
    // read only fields
    if (!frappe.user_roles.includes("Administrator")) {
      if (!frm.doc.__islocal) {
        frm.set_df_property('help_desk', 'read_only', 1);
        frm.set_df_property('date_of_visit', 'read_only', 1);
      }
    }
    // phoneno defult +91-
    if (frm.doc.alternate_contact_number.length < 10) {
      frm.doc.alternate_contact_number = '+91-'
      frm.refresh_fields("alternate_contact_number")
    }
    // set dropdown value by ordering
    frm.set_df_property('current_house_type', 'options', await get_ordered_list("House Types", ["Own", "Rented", "Relative's home", "Government quarter", "Others"]));

    // hide delete options for helpdesk and csc member
    apply_filter('select_primary_member', 'name_of_head_of_family', frm, ['!=', frm.doc.name])

    if (frappe.user_roles.includes("Help-desk member") || frappe.user_roles.includes("CSC Member") || frappe.user_roles.includes("MIS executive")) {
      if (!frappe.user_roles.includes("Administrator")) {
        frm.set_df_property('scheme_table', 'cannot_delete_rows', true); // Hide delete button
        frm.set_df_property('scheme_table', 'cannot_delete_all_rows', true);
        frm.set_df_property('follow_up_table', 'cannot_delete_rows', true); // Hide delete button
        frm.set_df_property('follow_up_table', 'cannot_delete_all_rows', true);
        frm.set_df_property('id_table_list', 'cannot_delete_rows', true); // Hide delete button
        frm.set_df_property('id_table_list', 'cannot_delete_all_rows', true);
      }
    }

    extend_options_length(frm, ["single_window", "help_desk",
      "source_of_information", "current_house_type", "state", "district", "occupational_category",
      "education", "ward", "name_of_the_settlement", "proof_of_disability", "block", "state_of_origin", "current_occupation", "district_of_origin", "social_vulnerable_category", "name_of_the_camp"])
    frm.set_query('religion', () => {
      return {
        order_by: 'religion.religion ASC'
      };
    });
    scheme_list = await get_scheme_list(frm)
    let tableConf = {
      columns: [
        {
          name: " ",
          id: 'serial_no',
          editable: false,
          resizable: true,
          sortable: false,
          focusable: false,
          dropdown: true,
          width: 70
        },
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
          id: 'matches',
          editable: false,
          resizable: false,
          sortable: false,
          focusable: false,
          dropdown: false,
          width: 200,
          format: (value, columns, ops, row) => {
            let rules = row?.rules?.map(e => `${e.message} ${e.matched ? '&#x2714;' : '&#10060;'}`).join("\n").toString()
            return `<p title="${rules}">${row?.matches?.bold()}</p>`
          }
        },
        {
          name: "Group",
          id: 'group',
          editable: false,
          resizable: false,
          sortable: false,
          focusable: false,
          dropdown: false,
          width: 200,
          format: (value, columns, ops, row) => {
            let messages = row.groups.map(g => (g.rules?.map(e => `${e.message} ${e.matched ? '&#x2714;' : '&#10060;'}`).join("\n").toString()))
            return `<p title="${messages.join('\n--------------   \n')}">${row?.groups?.filter(f => f.percentage == 100)?.length?.toString()?.bold()}/${row?.groups?.length?.toString()?.bold()}</p>`
          }
        },
        {
          name: "Availed",
          id: 'availed',
          editable: false,
          resizable: false,
          sortable: false,
          focusable: false,
          dropdown: false,
          width: 100,
          format: (value, columns, ops, row) => {
            return `<p style="text-align:center; color:green; font-size:18px; font-weight:600;">${value ? '' : '&#x2714;'}</p>`
          }
        }
      ],
      rows: []
    };
    let sno = 0;
    for (let scheme of scheme_list) {
      sno++
      tableConf.rows.push({
        serial_no: sno,
        name: `<a href="/app/scheme/${scheme?.name}">${scheme.name}</a>`,
        matches: `<a href="/app/scheme/${scheme?.name}">${scheme.matching_rules}/${scheme?.total_rules}</a>`,
        rules: scheme.rules,
        groups: scheme.groups,
        availed: scheme.available
      })
    }
    // console.log("tableConf", tableConf)
    const container = document.getElementById('all_schemes');
    const datatable = new DataTable(container, { columns: tableConf.columns, serialNoColumn: false });
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
      "district_of_origin", "block", "gender", "current_occupation",
      , "social_vulnerable_category", "pwd_category", "family",
      "help_desk", "single_window", "source_of_information", "occupational_category",
      "current_house_type", "name_of_the_settlement", "name_of_the_camp", "proof_of_disability"
    ])

    apply_filter("district", "State", frm, frm.doc.state)
    apply_filter("ward", "District", frm, frm.doc.district)
    apply_filter("name_of_the_settlement", "block", frm, frm.doc.ward)
    apply_filter("district_of_origin", "State", frm, frm.doc.state_of_origin)
    apply_filter("block", "District", frm, frm.doc.district_of_origin)
    // defult filter on current occupations
    if (frm.doc?.current_occupation) {
      if (frm.doc.current_occupation == 'Others') {
        apply_filter('occupational_category', 'name', frm, '', true)
      } else {
        let doc = await get_occupation_category(frm)
        apply_filter('occupational_category', 'name', frm, ['=', doc.occupational_category])
        frm.set_value('occupational_category', doc.occupational_category)
      }
    }
    if (frappe.user_roles.includes("Admin")) {
      apply_filter("help_desk", "single_window", frm, frm.doc.single_window)
    }
  },
  validate(frm) {
    console.log("validate:", frm.doc);
  },
  ////////////////////DATE VALIDATION/////////////////////////////////////////
  date_of_visit: function (frm) {
    if (new Date(frm.doc.date_of_visit) > new Date(frappe.datetime.get_today())) {
      frm.doc.date_of_visit = ''
      frm.set_value("date_of_visit", '')
      refresh_field('date_of_visit')
      frappe.throw(__("Date of visit can't be greater than today's date"))
    }
    if (frm.doc.date_of_visit && frm.doc.date_of_birth) {
      if (frm.doc.date_of_visit < frm.doc.date_of_birth) {
        frm.set_value('date_of_visit', '')
        return frappe.throw("Date of Visit shall not be before the <strong>Date of Birth</strong>")
      }
    }
  },

  state: function (frm) {
    apply_filter("district", "State", frm, frm.doc.state)
    frm.set_value("district", '')
    frm.set_value("ward", '')
    frm.set_value("name_of_the_settlement", '')
  },
  district: function (frm) {
    apply_filter("ward", "District", frm, frm.doc.district)
    frm.set_value("ward", '')
    frm.set_value("name_of_the_settlement", '')
  },
  ward: function (frm) {
    apply_filter("name_of_the_settlement", "block", frm, frm.doc.ward)
    frm.set_value("name_of_the_settlement", '')
  },
  state_of_origin: function (frm) {
    apply_filter("district_of_origin", "State", frm, frm.doc.state_of_origin)
    frm.set_value("district_of_origin", '')
    frm.set_value("block", '')
  },
  district_of_origin: function (frm) {
    apply_filter("block", "District", frm, frm.doc.district_of_origin)
    frm.set_value("block", '')
  },
  single_window: function (frm) {
    apply_filter("help_desk", "single_window", frm, frm.doc.single_window)
  },
  current_occupation: async function (frm) {
    if (!frm.doc.current_occupation) return;
    if (frm.doc.current_occupation == 'Others') {
      apply_filter('occupational_category', 'name', frm, '', true)
      frm.set_value('occupational_category', '')

    } else {
      let doc = await get_occupation_category(frm)
      apply_filter('occupational_category', 'name', frm, ['=', doc.occupational_category])
      frm.set_value('occupational_category', doc.occupational_category)
      frm.set_value('new_occupation', '')
    }
  },
  occupational_category: function (frm) {
    if (frm.doc.occupational_category != 'Others') {
      frm.set_value('new_occupation_category', '')
    }
  },
  date_of_birth: function (frm) {
    let dob = frm.doc.date_of_birth;
    if (frm.doc.date_of_visit && frm.doc.date_of_birth) {
      if (frm.doc.date_of_visit && frm.doc.date_of_birth) {
        if (frm.doc.date_of_visit < frm.doc.date_of_birth) {
          frm.set_value("date_of_birth", '')
          return frappe.throw("Date of Visit shall not be before the <strong>Date of Birth</strong>")
        }
      }
    }
    if (new Date(dob) > new Date(frappe.datetime.get_today())) {
      frm.doc.date_of_birth = ''
      refresh_field('date_of_birth')
      frappe.throw(__("Date of birth can't be greater than today's date"))
    }
    if (dob) {
      let today = frappe.datetime.get_today();
      let birthDate = new Date(dob);
      let currentDate = new Date(today);
      let years = currentDate.getFullYear() - birthDate.getFullYear();
      let months = currentDate.getMonth() - birthDate.getMonth();
      if (months < 0 || (months === 0 && currentDate.getDate() < birthDate.getDate())) {
        years--;
        months = 12 - birthDate.getMonth() + currentDate.getMonth();
      } else {
        months = currentDate.getMonth() - birthDate.getMonth();
      }
      if (currentDate.getDate() < birthDate.getDate()) {
        months--;
      }
      let ageString = years > 0 ? years.toString() : '0';
      let completedAgeMonths = months <= 11 ? months : null;
      frm.doc.completed_age = ageString;
      frm.doc.completed_age_month = completedAgeMonths;
      frm.refresh_fields('completed_age', 'completed_age_month')
      // frm.set_value('completed_age', ageString);
      // frm.set_value('completed_age_month', completedAgeMonths);
      // frm.set_df_property('completed_age', 'read_only', 1);
      // frm.set_df_property('completed_age_month', 'read_only', 1);
    } else {
      // frm.set_df_property('completed_age', 'read_only', 0);
      // frm.set_df_property('completed_age_month', 'read_only', 0);
      // frm.set_value('completed_age', '0');
      // frm.set_value('completed_age_month', null);
    }
  },
  completed_age: function (frm) {
    if (frm.doc.date_of_birth !== frappe.datetime.get_today()) {
      // let dob = generateDOBFromAge(frm.doc?.completed_age, frm.doc?.completed_age_month)
      // frm.set_value("date_of_birth", dob)
    }
    // console.log("dob", dob)
  },
  completed_age_month: function (frm) {
    if (frm.doc.completed_age_month > 11) {
      frm.doc.completed_age_month = ''
      refresh_field('completed_age_month')
      frappe.throw(__("Completed age in month should be less than or equal to 11"))
    }
    if (frm.doc.date_of_birth !== frappe.datetime.get_today()) {
      let dob = generateDOBFromAge(frm.doc?.completed_age, frm.doc?.completed_age_month)
      console.log("generatedDOB", dob, frm.doc?.completed_age, frm.doc?.completed_age_month);

      frm.set_value("date_of_birth", dob)
    }
    // console.log("dob", dob)
  },
  are_you_a_person_with_disability_pwd: function (frm) {
    if (frm.doc.are_you_a_person_with_disability_pwd == "No") {
      frm.set_value("type_of_disability", '')
      frm.doc.proof_of_disability = '';
      frm.doc.what_is_the_extent_of_your_disability = '';
      frm.refresh_fields('what_is_the_extent_of_your_disability', 'proof_of_disability')

    }
  },
  what_is_the_extent_of_your_disability: function (frm) {
    if (frm.doc.what_is_the_extent_of_your_disability != "Above 40%") {
      frm.doc.proof_of_disability = [];
      frm.refresh_fields('proof_of_disability')
    }
  },
  single_window: function (frm) {
    frm.set_value('help_desk', '')
  },
  marital_status: function (frm) {
    if (frm.doc.marital_status != "Married") {
      frm.set_value('spouses_name', '')
    }
  },
  social_vulnerable: function (frm) {
    if (frm.doc.social_vulnerable_category != "Yes") {
      frm.set_value('social_vulnerable_category', '')
      frm.set_value('other_social_vulnerable_category', '')
    }
  },
  social_vulnerable_category: function (frm) {
    if (frm.doc.social_vulnerable_category != "Others") {
      frm.set_value('other_social_vulnerable_category', '')
    }
  },
  source_of_information: function (frm) {
    if (frm.doc.source_of_information != "Others") {
      frm.set_value('new_source_of_information', '')
      frm.set_value('name_of_the_camp', '')
      frm.set_value('new_camp', '')
    }
  },
  name_of_the_camp: function (frm) {
    if (frm.doc.name_of_the_camp != "Others") {
      frm.set_value('new_camp', '')
    }
  },
  has_anyone_from_your_family_visisted_before: function (frm) {
    if (frm.doc.has_anyone_from_your_family_visisted_before == "Yes") {
      frm.set_value('select_primary_member', '')
    }
  },
  current_house_type: function (frm) {
    if (frm.doc.current_house_type != "Others") {
      frm.set_value('add_house_type', '')
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
// ********************* ID documents CHILD Table***********************
frappe.ui.form.on('ID Document Child', {
  form_render: async function (frm, cdt, cdn) {

  },
  id_table_list_add: async function (frm, cdt, cdn) {
    console.log("hello everyone")
    apply_filter_on_id_document()
  }
})

// ********************* Support CHILD Table***********************
frappe.ui.form.on('Scheme Child', {
  form_render: async function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.__islocal) {
      if (row.application_submitted == 'Yes' && (!row.date_of_application || !row.mode_of_application)) {
        row.status = ''
        createDialog(row, dialogsConfig.document_submitted, doc_submitted_validate).show();
      } else if (row.application_submitted == 'Completed' && (!row.date_of_application || !row.mode_of_application)) {
        createDialog(row, dialogsConfig.document_completed_frm_support, date_of_complete_validate).show();
      }
    }
  },
  scheme_table_add: async function (frm, cdt, cdn) {
    // get_milestone_category(frm)
    let schemes_op = frm.doc.scheme_table.filter(f => ['Open', 'Under Process', 'Closed'].includes(f.status)).map(e => e.name_of_the_scheme);
    let fl_schemes_ops = scheme_list.filter(f => !schemes_op.includes(f.name) && f.available)
    let milestones = {};
    let ops = fl_schemes_ops.map(e => {
      milestones.hasOwnProperty(e.milestone) ? '' : milestones[e.milestone] = e.milestone
      return { 'lable': e.name, "value": e.name }
    })
    frm.fields_dict.scheme_table.grid.update_docfield_property("name_of_the_scheme", "options", ops);
    frm.fields_dict.scheme_table.grid.update_docfield_property("milestone_category", "options", [{ 'lable': "", "value": "" }, ...Object.keys(milestones).map(e => { return { 'lable': milestones[e], "value": milestones[e] } })]);
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
    let schemes;
    if (row.milestone_category === "") {
      schemes = scheme_list;
    } else {
      schemes = scheme_list.filter(f => row.milestone_category == f.milestone);
    }
    let schemes_op = frm.doc.scheme_table.filter(f => ['Open', 'Under Process', 'Closed'].includes(f.status)).map(e => e.name_of_the_scheme);
    let ops = schemes.filter(f => !schemes_op.includes(f.name)).map(e => { return { 'lable': e.name, "value": e.name } })
    frm.fields_dict.scheme_table.grid.update_docfield_property("name_of_the_scheme", "options", ops);
  },
  application_submitted: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.application_submitted == "Yes") {
      row.status = ''; row.date_of_completion = '';
      frm.refresh_fields('status', 'date_of_completion')
      createDialog(row, dialogsConfig.document_submitted, doc_submitted_validate).show();
    } else if (["Completed", 'Previously availed'].includes(row.application_submitted)) {
      createDialog(row, dialogsConfig.document_completed_frm_support, date_of_complete_validate).show();
    } else if (row.application_submitted == "No") {
      row.date_of_application = ''; row.date_of_completion = ''; row.application_number = ''; row.amount_paid = ''; row.paid_by = "";
      frm.refresh_fields("date_of_application", "date_of_completion", "application_number", "amount_paid", "paid_by");
    }
  },

})

// ********************* FOLLOW UP CHILD Table***********************

frappe.ui.form.on('Follow Up Child', {
  form_render: async function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.__islocal) {
      if (row.follow_up_status == 'Document submitted' && (!row.date_of_application || !row.mode_of_application)) {
        row.status = ''
        createDialog(row, dialogsConfig.document_submitted, doc_submitted_validate).show();
      } else if (row.follow_up_status == 'Completed' && !row.date_of_completion) {
        createDialog(row, dialogsConfig.document_completed, date_of_complete_validate).show();
      } else if (row.follow_up_status == 'Rejected' && (!row.date_of_rejection || !row.reason_of_rejection)) {
        createDialog(row, dialogsConfig.document_rejected, doc_rejected_validate).show();
      }
    }
  },
  async follow_up_table_add(frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (frappe.user_roles.includes("Help-desk member")) {
      let help_desk = await get_ordered_list("Help Desk", false)
      // console.log("help_desk", help_desk)
      frm.fields_dict.follow_up_table.grid.update_docfield_property("follow", "options", help_desk);
    } else {
      frm.fields_dict.follow_up_table.grid.update_docfield_property("follow", "options", [`${frappe.session.user_fullname}`]);
      row.follow = frappe.session.user_fullname
    }
    // call api of list of helpdesk with checking roles
    let support_data = frm.doc.scheme_table.filter(f => (f.status != 'Completed' && f.status != 'Rejected' && !f.__islocal)).map(m => m.name_of_the_scheme);
    row.follow_up_date = frappe.datetime.get_today()
    frm.fields_dict.follow_up_table.grid.update_docfield_property("name_of_the_scheme", "options", support_data);
  },
  name_of_the_scheme: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    let supports = frm.doc.scheme_table.filter(f => f.scheme == row.name_of_the_scheme);
    row.date_of_application = supports[0].date_of_application
    // console.log(supports, "supports")
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
    console.log("follow up", row)
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
    if (row.follow_up_date < frm.doc.date_of_visit) {
      row.follow_up_date = null
      frappe.throw(__("Follow-up date should not be less than date of date of visit"));
    }
  },
  follow_up_with: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.follow_up_with == "Government department" || row.follow_up_with == "Others") {
      frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_mode", "options", ["Phone call", "In-person visit"]);
    } else {
      frm.fields_dict.follow_up_table.grid.update_docfield_property("follow_up_mode", "options", ["Phone call", "Home visit", "Centre visit"]);
    }
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
