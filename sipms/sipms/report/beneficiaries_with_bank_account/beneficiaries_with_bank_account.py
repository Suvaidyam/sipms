# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from sipms.utils.report_filter import ReportFilter

def execute(filters=None):
	# frappe.errprint(filters)
	columns = [
		{
		"fieldname":"bank_account",
		"label":"Bank account status of Beneficiaries",
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
			do_you_have_any_bank_account as bank_account,
			COUNT(do_you_have_any_bank_account) as count
		FROM
			`tabBeneficiary Profiling`
		WHERE
		do_you_have_any_bank_account IS NOT NULL {condition_str}
		GROUP BY
		bank_account;
	"""
	data = frappe.db.sql(sql_query, as_dict=True)
	return columns, data