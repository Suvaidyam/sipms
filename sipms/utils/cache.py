import frappe

class  Cache:
    # Adminstartor  = all list
    # Admin =  all state data
    # mis executive = single_window data
    # CSC member = single windows data
    # Help-desk member = locations 

    def get_csc(user = None):
        if not user:
            user = frappe.session.user
        value = frappe.cache().get_value("filter-"+user)
        if value is None:
            if(("Administrator" not in frappe.get_roles(user))):
                usr = frappe.get_doc("Sipms User", user)
            if "Admin" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
                frappe.cache().set_value('filter-'+user, usr.state)
            elif "CSC Member" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
                frappe.cache().set_value('filter-'+user, usr.single_window)
            elif "Help-desk member" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
                frappe.cache().set_value('filter-'+user, usr.help_desk)
            elif "MIS executive" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
                frappe.cache().set_value('filter-'+user, usr.single_window)
            else:
                return
        return frappe.cache().get_value("filter-"+user)