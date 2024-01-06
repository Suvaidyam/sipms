# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.report_filter import ReportFilter

def execute(filters=None):
	# frappe.errprint(filters)
	columns = [
		{
		"fieldname":"gender",
		"label":"Gender",
		"fieldtype":"Data",
		"width":300
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
			gender as gender,
			COUNT(gender) as count
		FROM
			`tabBeneficiary Profiling`
		WHERE
		1=1 {condition_str}
		GROUP BY
		gender;
	"""
	data = frappe.db.sql(sql_query, as_dict=True)
	# chart = get_chart(data)
	return columns, data

# def get_chart(data):

#     values = []
#     for d in data:
#         values.append(d["count"])

#     return{
# 		"data":{
# 			"labels":["Female","Male"],
# 			"datasets":[{"name":"Gender Composition", "values":values}]
# 		},
# 		"type":"pie"
# 	}