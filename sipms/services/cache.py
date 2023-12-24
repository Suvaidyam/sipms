import frappe

class  Cache:
    # Adminstartor  = all list
    # Admin =  all state data
    # mis executive = single_window data
    # CSC member = single windows data
    # Help-desk member = locations 

    def get_csc(user = None):
        # if "MIS executive" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
        if not user:
            user = frappe.session.user
        value = frappe.cache().get_value("csc-"+user)
        if value is None:
            usr = frappe.get_doc("User", user)
            frappe.cache().set_value('csc-'+user, usr.csc)
        return frappe.cache().get_value("csc-"+user)