import frappe
from sipms.utils.cache import Cache
def list_query(user):
    if not user:
        user = frappe.session.user
        
    value = Cache.get_csc()
    if "Admin" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
        return """(`tabPrimary Member`.state = '{0}')""".format(value)
    elif "CSC Member" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
        return """(`tabPrimary Member`.single_window = '{0}')""".format(value)
    elif "Help-desk member" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
        return """(`tabPrimary Member`.help_desk = '{0}')""".format(value)
    elif "MIS executive" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
        return """(`tabPrimary Member`.single_window = '{0}')""".format(value)
    else:
        return ""
