import frappe
from sipms.utils.cache import Cache

from sipms.utils.filter import Filter
def list_query(user):
    print("//////////////////////////////////////////",Filter.set_query_filters())
    value = Cache.get_csc()
    if "Admin" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
        return """(`tabBeneficiary Profiling`.state = '{0}')""".format(value)
    elif "CSC Member" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
        return """(`tabBeneficiary Profiling`.help_desk = '{0}')""".format(value)
    elif "Help-desk member" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
        return """(`tabBeneficiary Profiling`.help_desk = '{0}')""".format(value)
    elif "MIS executive" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
        return """(`tabBeneficiary Profiling`.single_window = '{0}')""".format(value)
    else:
        return ""
