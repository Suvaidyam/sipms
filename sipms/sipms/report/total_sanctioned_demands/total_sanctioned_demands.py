import frappe
from sipms.utils.report_filter import ReportFilter

def execute(filters=None):
    columns = [
        {
            "fieldname": "status",
            "label": "Current status",
            "fieldtype": "Data",
            "width": 400,
        },
        {
            "fieldname": "count",
            "label": "Count",
            "fieldtype": "Int",
            "width": 200
        }
    ]

    condition_str = ReportFilter.set_report_filters(filters, 'creation', True)
    if condition_str:
        condition_str = f"AND {condition_str}"
    else:
        condition_str = ""

    sql_query = f"""
        SELECT
            status,
            COUNT(name) as count
        FROM
            `tabScheme Child`
        WHERE
            status = 'Completed'
       # {condition_str}
    """

    data = frappe.db.sql(sql_query, as_dict=True)
    return columns, data