import frappe
from sipms.utils.filter import Filter

def execute(filters=None):
    columns = [
        {
            "fieldname": "application_submitted",
            "label": "Application Submitted",
            "fieldtype": "Data",
            "width": 400
        },
        {
            "fieldname": "count",
            "label": "Count",
            "fieldtype": "Int",
            "width": 200
        }
    ]

    condition_str = Filter.set_report_filters(filters, 'creation', True)

    sql_query = f"""
        SELECT
            application_submitted,
            COUNT(name) as count
        FROM
            `tabScheme Child`
        WHERE
            (application_submitted = 'No' AND status = 'Open')
            OR (application_submitted = 'Yes' AND status = 'Under Process')
            {condition_str}
        GROUP BY
            application_submitted;
    """

    data = frappe.db.sql(sql_query, as_dict=True)
    return columns, data