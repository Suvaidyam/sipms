# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.report_filter import ReportFilter
from sipms.utils.misc import Misc
def execute(filters=None):
	# frappe.errprint(filters)
	columns = [
		{
			"fieldname":"scheme",
			"label":"Scheme",
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

	# filter_condition_str = ReportFilter.set_report_filters(filters, 'date_of_visit', True, 't1')
	get_all_scheme = frappe.db.sql(f"SELECT name FROM `tabScheme`", as_dict=True)
	scheme_ben_count_list = []

	for scheme in get_all_scheme:
		conditions = []
		rule_cond_str = Misc.scheme_rules_to_condition(scheme.name)
		
		if rule_cond_str:
			conditions.append(rule_cond_str)
		
		get_eligible_ben = """
			SELECT
				COUNT(name) AS count
			FROM
				`tabBeneficiary Profiling`
			{}
		""".format(('WHERE ' + ' AND '.join(conditions)) if conditions else "")
		
		print("get_eligible_ben")
		ben_result = frappe.db.sql(get_eligible_ben, as_dict=True)
		
		scheme_ben_count_list.append({"scheme": scheme.name, "count": (ben_result[0].count if len(ben_result) else 0)})

	sorted_schemes = sorted(scheme_ben_count_list, key=lambda x: x["count"], reverse=True)
	# Get the top 5 schemes
	top_5_schemes = sorted_schemes[:5]

	return columns, top_5_schemes
