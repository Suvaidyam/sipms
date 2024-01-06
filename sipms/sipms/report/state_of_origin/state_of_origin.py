# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.report_filter import ReportFilter

def execute(filters=None):
	# frappe.errprint(filters)
	columns = [
		{
			"fieldname":"state",
			"label":"State",
			"fieldtype":"Data",
			"width":400
		},
		{
			"fieldname":"count",
			"label":"Count",
			"fieldtype":"int",
			"width":200
		}
	]

	condition_str = ReportFilter.set_report_filters(filters, 'creation', True)
	if condition_str:
		condition_str = f"AND {condition_str}"
	else:
		condition_str = ""

	sql_query = f"""
	SELECT
		t2.state_name as state,
		COUNT(t1.state) as count
	FROM
		`tabBeneficiary Profiling` AS t1
	LEFT JOIN
		`tabState` AS t2 ON t1.state = t2.name
	WHERE
		1=1 {condition_str}
	GROUP BY
		t1.state;
	"""
	data = frappe.db.sql(sql_query, as_dict=True)

	return columns, data
