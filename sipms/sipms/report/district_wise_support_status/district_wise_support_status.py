# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.report_filter import ReportFilter


def execute(filters=None):
    columns = [
        {
            "fieldname": "district_name",
            "label": " Name Of District ",
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

    condition_str = ReportFilter.set_report_filters(filters, '', True)
    if condition_str:
        condition_str = f"WHERE {condition_str}"
    else:
        condition_str = ""

    sql_query = f"""
SELECT
    s.state_name,
    d.district_name,
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
    `tabState` s ON bp.state = s.name
LEFT JOIN
    `tabDistrict` d ON bp.district = d.name
{condition_str}
GROUP BY
    s.state_name, d.district_name;
"""


    data = frappe.db.sql(sql_query, as_dict=True)
    return columns, data