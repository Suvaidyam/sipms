# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.filter import Filter


def execute(filters=None):
    columns = [
        {
            "fieldname": "milestone_category",
            "label": "Milestone ",
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

    condition_str = Filter.set_report_filters(filters, '', True)
    if condition_str:
        condition_str = f"AND {condition_str}"
    else:
        condition_str = ""

    sql_query = f"""
    SELECT
        milestone_category,
        COUNT(*) as count,
        SUM(CASE WHEN (application_submitted = 'No' AND status = 'Open') THEN 1 ELSE 0 END) as open_demands,
        SUM(CASE WHEN (status = 'Completed' AND application_submitted = 'Yes') THEN 1 ELSE 0 END) as completed_demands,
        SUM(CASE WHEN (status = 'Completed' AND application_submitted = 'Yes') THEN 1 ELSE 0 END) as closed_demands,
        SUM(CASE WHEN (status = 'Under process' AND application_submitted = 'Yes') THEN 1 ELSE 0 END) as submitted_demands,
        SUM(CASE WHEN (status = 'Rejected' AND application_submitted = 'Yes') THEN 1 ELSE 0 END) as rejected_demands,
        SUM(CASE WHEN (application_submitted = 'No' AND status = 'Open') OR (application_submitted = 'Yes' AND status = 'Under process') THEN 1 ELSE 0 END) as total_demands
    FROM
        `tabScheme Child`
    WHERE
        1=1 {condition_str}
    GROUP BY
        milestone_category;
"""


    data = frappe.db.sql(sql_query, as_dict=True)
    return columns, data
