# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.filter import Filter

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

	new_filters = Filter.set_report_filters(filters, 'creation')

	data = frappe.get_all("Beneficiary Profiling",
	filters=new_filters,
	fields=["state_of_origin.state_name as state",'count(`tabBeneficiary Profiling`.name) as count'],
	group_by='state')

	return columns, data
