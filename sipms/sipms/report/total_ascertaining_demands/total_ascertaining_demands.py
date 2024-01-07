import frappe
from sipms.utils.report_filter import ReportFilter

def execute(filters=None):
    columns = [
        {
            "fieldname": "current_status",
            "label": "Current status",
            "fieldtype": "Data",
            "width": 400,
        },
        {
            "fieldname": "status",
            "label": "Count",
            "fieldtype": "Int",
            "width": 400,
        },
   
    ]

    condition_str = ReportFilter.set_report_filters(filters, 'date_of_visit', True)
    if condition_str:
        condition_str = f"AND {condition_str}"
    else:
        condition_str = ""

    sql_query = f"""
        SELECT
            status as current_status,
            COUNT(status) as status
        FROM
            `tabScheme Child`
        # -- WHERE
        # -- {condition_str} OR 1=1
        GROUP BY
            status;
    """
    # sql_query = """
    # SELECT
    #     `tabScheme Child`.status AS current_status,
    #     COUNT(`tabScheme Child`.status) AS status
    # FROM
    #     `tabScheme Child`
    # LEFT JOIN
    #     `tabBeneficiary Profiling` ON `tabScheme Child`.parent = `tabBeneficiary Profiling`.name
    #  WHERE
    #     {condition_str} OR 1=1
    # GROUP BY
    #     `tabScheme Child`.status;
    # """

    data = frappe.db.sql(sql_query, as_dict=True)
    return columns, data
