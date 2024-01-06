import frappe
from sipms.utils.cache import Cache


class Filter:
    def set_query_filters(doctype=None):
        roles = frappe.get_roles(frappe.session.user)
        if("Administrator" not in roles):
            cond_str = ""
            if "Admin" in roles:
                cond_str = "state"
            elif "MIS executive" in roles:
                cond_str = "single_window"
            elif "CSC Member" in roles:
                cond_str = "single_window"
            elif "Help-desk member" in roles:
                cond_str = "help_desk"
            value = Cache.get_csc()
            # return """(`tab{0}`.help_desk = '{1}')""".format(doctype , value)
            return f"""{cond_str} = '{value}'""" 
        return ""
