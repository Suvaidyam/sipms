import frappe

class  LoginUser:
    def get_single_windows():
        usr = frappe.get_doc("Sipms User", frappe.session.user)
        return usr.single_window

    def get_helpdesk():
        usr = frappe.get_doc("Sipms User", frappe.session.user)
        return usr.help_desk