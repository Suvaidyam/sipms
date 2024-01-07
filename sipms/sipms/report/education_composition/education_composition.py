# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.report_filter import ReportFilter

def execute(filters=None):
	# frappe.errprint(filters)
	columns = [
		{
			"fieldname":"education",
			"label":"Education of beneficiary",
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
	new_filters = ReportFilter.set_report_filters(filters, 'date_of_visit')


	data = frappe.get_all("Beneficiary Profiling",
	filters=new_filters,
	fields=["education as education",'count(name) as count'],
	group_by='education')

	for result in data:
		if result.education is None:
			result.education = 'None'
	return columns, data
