// Copyright (c) 2023, suvaidyam and contributors
// For license information, please see license.txt
var common_operators = ["=", "!="]
var field_types = {
    "Date": [...common_operators, ">", "<", ">=", "<="],
    "Int": [...common_operators, ">", "<", ">=", "<="],
    "Link": [...common_operators],
    "Select": [...common_operators],
    "Currency":[...common_operators , ">", "<", ">=", "<="]
}
function evaluateExpression(input, expression) {
    if (!(/^[a-zA-Z0-9\s()+\-/*%&|=!<>]*$/.test(expression))) {
        return 'Invalid expression'
    }
    // expression = expression.toLowerCase();
    expression = expression.replace(/and/g, '&&').replace(/or/g, '||');
    expression = expression.replace(/AND/g, '&&').replace(/OR/g, '||');
    for (let key in input) {
        expression = expression.replace(new RegExp(key, 'g'), input[key]);
    }
    try {
        return eval(expression);
    } catch (err) {
        return err.message;
    }
}
function generateQueryString(rows, __expression) {
    let expression = __expression.replace(/and/g, '#').replace(/or/g, '%');
    expression = expression.replace(/AND/g, '#').replace(/OR/g, '%');
    for (let row of rows) {
        if (['IN', 'NOT IN'].includes(row.operator)) {
            let val = row.data?.split(',').map(e => `'${e}'`).join(',');
            expression = expression.replace(new RegExp(row.code, 'g'), `${row.rule_field} ${row.operator} (${val})`)
        } else {
            expression = expression.replace(new RegExp(row.code, 'g'), `${row.rule_field} ${row.operator} '${row.data}'`)
        }
    }
    expression = expression.replace(/#/g, 'AND').replace(/%/g, 'OR');
    return 'select * from `tabBeneficiary Profiling` where ' + expression
}
var field_list = []
function get_field_list(child_table_field, frm) {
    console.log("called");
    frappe.call({
        method: "sipms.rule_engine.apis.get_meta_api.get_field_lists",
        args: {
            doctype_name: "Beneficiary Profiling",
            field_types: Object.keys(field_types)
        },
        callback: function (response) {
            // Handle the response
            if (response.message) {
                field_list = response.message
                frm.fields_dict[child_table_field].grid.update_docfield_property("rule_field", "options", response.message);
                console.log(response.message);
            } else {
                // console.error("API call failed");
            }
        }
    });

}
function get_Link_list(doctype_name) {
    return new Promise((resolve, reject) => {
        frappe.call({
            method: "frappe.desk.search.search_link",
            args: {
                doctype: doctype_name,
                txt: "",
                page_length: 10000
            },
            callback: async function (response) {
                let data = response?.results || response?.message
                if (data) {
                    resolve(data);
                }
            }
        });
    })
}
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
  const get_ben_list = async (frm) => {
    let list = await callAPI({
      method: 'sipms.api.eligible_beneficiaries',
      freeze: true,
      args: {
        "scheme": frm.doc.name_of_the_scheme
      },
      freeze_message: __("Getting beneficiaries..."),
    })
    // scheme_list = list.sort((a, b) => b.matching_rules_per - a.matching_rules_per);
    return list
  }
frappe.ui.form.on("Scheme", {
    async refresh(frm) {
        let ben_list = await get_ben_list(frm)
        let tableConf = {
            columns: [
              {
                name: "Name of beneficiary",
                id: 'name',
                editable: false,
                resizable: false,
                sortable: false,
                focusable: false,
                dropdown: true,
                width: 400
              },
              {
                name: "Phone number",
                id: 'phone_number',
                editable: false,
                resizable: false,
                sortable: false,
                focusable: false,
                dropdown: false,
                width: 400,
              }
            ],
            rows: []
          };
          for (let scheme of ben_list) {
            console.log("scheme", scheme)
            tableConf.rows.push({
              name: `<a href="/app/beneficiary-profiling/${scheme.name}">${scheme.name_of_the_beneficiary}</a>`,
              phone_number: scheme.contact_number
            })
          }
          const container = document.getElementById('eligible_beneficiaries');
          const datatable = new DataTable(container, { columns: tableConf.columns });
          datatable.style.setStyle(`.dt-scrollable`, { height: '300px!important', overflow: 'scroll!important' });
          datatable.style.setStyle(`.dt-instance-1 .dt-cell__content--col-0`, { width: '660px' });
          datatable.refresh(tableConf.rows);
          console.log("tableConf.rows", tableConf.rows)

        frm.set_query("name_of_department", () => { return { page_length: 1000 }; });


        if(frm.doc.department_urlwebsite){
            frm.add_web_link(frm?.doc?.department_urlwebsite)
        }

          
    },
    name_of_department:function(frm){
        if(frm.doc.department_urlwebsite){
            frm.add_web_link(frm?.doc?.department_urlwebsite)
        }
    }
});
// CHILD TABLE
var child_table_field = 'rules'
const form_events = {
    [`${child_table_field}_add`]: (frm, cdt, cdn) => {
        console.log("row added");
        let initial_code = 64
        let row = frappe.get_doc(cdt, cdn);
        if (row.idx <= 26) {
            row.code = (String.fromCharCode(initial_code + row.idx))
        } else {
            row.code = (String.fromCharCode(initial_code + (row.idx - 26)) + String.fromCharCode(initial_code + (row.idx - 26)))
        }
        get_field_list('rules', frm)
    }
}
frappe.ui.form.on('Rule Engine Child', {
    refresh(frm) {
        console.log("refresh");
    },
    ...form_events,
    rule_field: async function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        row.type = field_list?.find(f => f.value == row.rule_field)?.type;
        frm.fields_dict[child_table_field].grid.update_docfield_property("operator", "options", field_types[row.type]);
        let options = field_list.find(f => f.value == row.rule_field)?.options;

        if (row.type == "Link") {
            let link_data = await get_Link_list(options)
            frm.fields_dict[child_table_field].grid.update_docfield_property("select", "options", link_data);
        }
        if (row.type == "Select") {
            let link_data = options?.split('\n').filter(f =>f).map(e=>{return{'label':e , 'value': e}})
            frm.fields_dict[child_table_field].grid.update_docfield_property("select", "options", link_data);
        }
        frm.fields_dict[child_table_field].grid.refresh();
        var cur_grid = frm.get_field(`${child_table_field}`).grid;
        var cur_doc = locals[cdt][cdn];
        var cur_row = cur_grid.get_row(cur_doc.name);
        cur_row.toggle_view();
    },
    date: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        row.data = row.date
        frm.fields_dict[child_table_field].grid.refresh();
    },
    select: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        row.data = row.select
        frm.fields_dict[child_table_field].grid.refresh();
    },
    value: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        row.data = row.value
        frm.fields_dict[child_table_field].grid.refresh();
    }
})