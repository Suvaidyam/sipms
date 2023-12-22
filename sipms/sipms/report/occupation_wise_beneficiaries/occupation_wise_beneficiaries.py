# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt
import frappe
from sipms.utils.filter import Filter

def execute(filters=None):
    columns = [
        {
            "fieldname": "Occupation",
            "label": "Occupation",
            "fieldtype": "Data",
            "width": 200
        },
        {
            "fieldname": "Number_of_Beneficiaries",
            "label": "Number of Beneficiaries",
            "fieldtype": "Int",
            "width": 300
        }
    ]

    condition_str = Filter.set_report_filters(filters, 'creation', True)

    if condition_str:
        condition_str = f"WHERE {condition_str}"
    else:
        condition_str = ""

    sql_query = f"""
        SELECT
            current_occupation AS Occupation,
            COUNT(*) AS Number_of_Beneficiaries
        FROM
            `tabBeneficiary Profiling`
        {condition_str}
        GROUP BY
            current_occupation
    """

    data = frappe.db.sql(sql_query, as_dict=True)
    return columns, data
