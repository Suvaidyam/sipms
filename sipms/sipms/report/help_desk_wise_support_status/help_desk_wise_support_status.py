# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.report_filter import ReportFilter


def execute(filters=None):
    columns = [
        {
            "fieldname": "help_desk_name",
            "label": " Help Desk Name",
            "fieldtype": "Data",
            "width": 200,

        },
        {
            "fieldname": "total_demands",
            "label": "Total Demands",
            "fieldtype": "Data",
            "width": 130,
        },
        {
            "fieldname": "open_demands",
            "label": "Open Demands",
            "fieldtype": "Data",
            "width": 130,
        },
        {
            "fieldname": "submitted_demands",
            "label": "Submitted Demands",
            "fieldtype": "Data",
            "width": 160,
        },
        {
            "fieldname": "completed_demands",
            "label": "Completed Demands",
            "fieldtype": "Data",
            "width": 170,
        },
        {
            "fieldname": "rejected_demands",
            "label": "Rejected Demands",
            "fieldtype": "Data",
            "width": 130,
        },
        {
            "fieldname": "closed_demands",
            "label": "Closed Demands",
            "fieldtype": "Data",
            "width": 130,
        },

        {
            "fieldname": "count",
            "label": " Total Count",
            "fieldtype": "Int",
            "width": 140
        }
    ]
    # user_role = frappe.get_roles(frappe.session.user)
    # print(user_role)
    # is_adminstrator = "Administrator" in user_role
    # is_admin = "Admin" in user_role
    # is_help_desk_member = "Help-desk member" in user_role
    # is_csc_member = "CSC Member" in user_role
    # is_mis_executive = "MIS executive" in user_role

    # if not is_adminstrator:
    #     user_state = frappe.db.get_value("User", frappe.session.user, "state")
    #     condition_str = Filter.set_report_filters(filters, user_state, True)
    # elif is_help_desk_member:
    #     user_help_desk = frappe.db.get_value("User", frappe.session.user, "help_desk")
    #     condition_str = Filter.set_report_filters(filters, user_help_desk, True)
    # elif is_csc_member:
    #     user_csc = frappe.db.get_value("User", frappe.session.user, "help_desk")
    #     condition_str = Filter.set_report_filters(filters, user_csc, True)
    # elif is_mis_executive:
    #     user_single_window = frappe.db.get_value("User", frappe.session.user, "single_window")
    #     condition_str = Filter.set_report_filters(filters, user_single_window, True)
    # else:
    #     condition_str = Filter.set_report_filters(filters, '', True)                      
    

    condition_str = ReportFilter.set_report_filters(filters, '', True)
    condition_str = f"WHERE {condition_str}" if condition_str else ""

    sql_query = f"""
SELECT
    hd.help_desk_name,
    COUNT(*) as count,
    SUM(CASE WHEN (sc.application_submitted = 'No' AND sc.status = 'Open') THEN 1 ELSE 0 END) as open_demands,
    SUM(CASE WHEN (sc.status = 'Completed' AND sc.application_submitted = 'Yes') THEN 1 ELSE 0 END) as completed_demands,
    SUM(CASE WHEN (sc.status = 'Completed' AND sc.application_submitted = 'Yes') THEN 1 ELSE 0 END) as closed_demands,
    SUM(CASE WHEN (sc.status = 'Under process' AND sc.application_submitted = 'Yes') THEN 1 ELSE 0 END) as submitted_demands,
    SUM(CASE WHEN (sc.status = 'Rejected' AND sc.application_submitted = 'Yes') THEN 1 ELSE 0 END) as rejected_demands,
    SUM(CASE WHEN (sc.application_submitted = 'No' AND sc.status = 'Open') OR (sc.application_submitted = 'Yes' AND sc.status = 'Under process') THEN 1 ELSE 0 END) as total_demands
FROM
    `tabBeneficiary Profiling` bp
LEFT JOIN
    `tabScheme Child` sc ON bp.name = sc.parent
LEFT JOIN
    `tabHelp Desk` hd ON bp.help_desk = hd.name 
{condition_str}
GROUP BY
    hd.help_desk_name;
"""



    data = frappe.db.sql(sql_query, as_dict=True)
    return columns, data