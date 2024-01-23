# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.report_filter import ReportFilter

def execute(filters=None):
	# frappe.errprint(filters)
	columns = [
		{
			"fieldname":"scheam",
			"label":"scheam",
			"fieldtype":"Data",
			"width":400
		},
		{
			"fieldname":"bencount",
			"label":"Count",
			"fieldtype":"int",
			"width":200
		}
	]

	condition_str = ReportFilter.set_report_filters(filters, 'date_of_visit', True, 't1')
	if condition_str:
		condition_str = f"AND {condition_str}"
	else:
		condition_str = ""

	scheam_ben_count =[]
	scheame_query = f"""select name  from `tabScheme` """
	get_all_scheame = frappe.db.sql(scheame_query, as_dict=True)
	for scheme in get_all_scheame:
			get_rules = f"""select  rule_field, operator, data from `tabScheme` as _ts JOIN `tabRule Engine Child` as _tsc on _tsc.parent = _ts.name where _ts.name_of_the_scheme ='{scheme.name.replace("'", "''")}';"""

			# get_rules = f"""select  rule_field, operator, data from `tabScheme` as _ts JOIN `tabRule Engine Child` as _tsc on _tsc.parent = _ts.name where _ts.name_of_the_scheme ='{scheme.name}';"""
			rules = frappe.db.sql(get_rules, as_dict=True)
			condition_str =""
			if rules:
				for rule in rules:
					condition_str = f"""{condition_str} {rule.rule_field} {rule.operator} '{rule.data}' AND"""
				# condition_str = f"{condition_str} "  
			else:
				condition_str = ""
			get_elegible_ben = f""" SELECT count(name) as abc FROM `tabBeneficiary Profiling` WHERE{condition_str} 1=1 order by abc DESC"""
			all_ben = frappe.db.sql(get_elegible_ben, as_dict=True)
			sch_ben = {"scheam": scheme.name , "bencount": all_ben[0].abc}
			scheam_ben_count.append(sch_ben)
	sorted_schemes = sorted(scheam_ben_count, key=lambda x: x["bencount"], reverse=True)
		# Get the top 5 schemes
	top_5_schemes = sorted_schemes[:5]
		# data = frappe.db.sql(sql_query, as_dict=True)
	return columns, top_5_schemes
