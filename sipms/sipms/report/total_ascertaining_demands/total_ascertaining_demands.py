import frappe
from sipms.utils.filter import Filter

def execute(filters=None):
    columns = [
        {
            "fieldname": "status",
            "label": "Total ascertaining demands",
            "fieldtype": "Int",
            "width": 400,
        },
   
    ]

    condition_str = Filter.set_report_filters(filters, 'creation', True)
    if condition_str:
        condition_str = f"AND {condition_str}"
    else:
        condition_str = ""

    sql_query = f"""
        SELECT
            COUNT(status) as status
        FROM
            `tabScheme Child`
    """

    data = frappe.db.sql(sql_query, as_dict=True)
    return columns, data
