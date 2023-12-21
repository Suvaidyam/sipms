# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.filter import Filter

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
	new_filters = Filter.set_report_filters(filters, 'registration_date')
	gender = frappe.get_all("Beneficiary Profiling",
	filters=new_filters,
	fields=["gender as gender",'count(name) as count'],
	group_by='gender')

	# data = [{"gender":"Male" , "count":"0"},
	# 	 {"gender":"Female", "count":"0"}]
	data = gender
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