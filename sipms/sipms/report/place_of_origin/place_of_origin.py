# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.report_filter import ReportFilter


def execute(filters=None):
    columns = [
        {
            "fieldname": "state",
            "label": "State",
            "fieldtype": "Data",
            "width": 400
        },
        {
            "fieldname": "district",
            "label": "District",
            "fieldtype": "Data",
            "width": 400
        },
        {
            "fieldname": "count",
            "label": "Count",
            "fieldtype": "int",
            "width": 200
        }
    ]
    condition_str = ReportFilter.set_report_filters(filters, 'date_of_visit', True, 'b')
    if condition_str:
        condition_str = f"{condition_str}"
    else:
        condition_str = "1=1"
    print("condition_str", condition_str)
    sql_query = f"""
    SELECT
        s.state_name AS state,
        d.district_name AS district,
        COUNT(b.name) AS count
    FROM
        `tabBeneficiary Profiling` AS b
        JOIN tabState AS s ON b.state_of_origin = s.name
        JOIN tabDistrict AS d ON b.district_of_origin = d.name
    WHERE {condition_str}
    GROUP BY
        b.state_of_origin, b.district_of_origin
    ORDER BY
        b.state_of_origin, b.district_of_origin;
"""
    
    data = frappe.db.sql(sql_query, as_dict=True)
    return columns, data
