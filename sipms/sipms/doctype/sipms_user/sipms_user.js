// Copyright (c) 2023, suvaidyam and contributors
// For license information, please see license.txt
function defult_filter(field_name, filter_on, frm) {
    frm.fields_dict[field_name].get_query = function (doc) {
        return {
            filters: {
                [filter_on]: frm.doc.filter_on || `please select ${filter_on}`,
            },
        };
    }
};
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
function extend_options_length(frm, fields) {
    fields.forEach((field) => {
        frm.set_query(field, () => {
            return { page_length: 1000 };
        });
    })
};
function hide_advance_search(frm, list) {
    for (item of list) {
      frm.set_df_property(item, 'only_select', true);
    }
  };
frappe.ui.form.on("Sipms User", {
    refresh(frm) {
        frm.doc.state ? apply_filter("single_window", "state", frm, frm.doc.state) : defult_filter('single_window', "state", frm);
        // frm.doc.single_window ? apply_filter("help_desk", "single_window", frm, frm.doc.single_window) : defult_filter('help_desk', "single_window", frm);
        extend_options_length(frm, ["state"])
        hide_advance_search(frm , ["role_profile", "state" , "single_window"])
    },
    role_profile: function (frm) {

    },
    state: function (frm) {
        if (frm.doc.state) {
            apply_filter("single_window", "state", frm, frm.doc.state)
        } else {
            defult_filter('single_window', "state", frm)
        }
    },
    // single_window: function (frm) {
    //     if (frm.doc.single_window) {
    //         apply_filter("help_desk", "single_window", frm, frm.doc.single_window)
    //     } else {
    //         defult_filter('help_desk', "single_window", frm);
    //     }
    // }
});
