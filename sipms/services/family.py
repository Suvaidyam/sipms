import frappe
from sipms.utils.login_user_details import LoginUser

class family:
    def create(beneficiary):
        family_doc = frappe.new_doc("Primary Member")
        family_doc.name_of_head_of_family = beneficiary.name
        family_doc.name_of_parents = beneficiary.name_of_the_beneficiary
        family_doc.phone_no = beneficiary.contact_number
        family_doc.state = beneficiary.state
        family_doc.single_window = beneficiary.single_window
        family_doc.help_desk = beneficiary.help_desk
        family_doc.save()
        return family_doc


    def update(beneficiary):
        family_doc_name = frappe.db.exists('Primary Member', beneficiary.contact_number)
        if(family_doc_name):
            family_doc = frappe.get_doc("Primary Member", family_doc_name)
            family_doc.name_of_parents = beneficiary.name
            family_doc.phone_no = beneficiary.contact_number
            family_doc.state = beneficiary.state
            family_doc.single_window = beneficiary.single_window
            family_doc.help_desk = beneficiary.help_desk
            family_doc.save()
            return family_doc
        else:
            family_doc = frappe.new_doc("Primary Member")
            family_doc.name_of_head_of_family = beneficiary.name
            family_doc.name_of_parents = beneficiary.name_of_the_beneficiary
            family_doc.phone_no = beneficiary.contact_number
            family_doc.single_window = beneficiary.single_window
            family_doc.help_desk = beneficiary.help_desk
            family_doc.state = beneficiary.state
            family_doc.insert()
            return family_doc
        

    def delete_family(beneficiary):
        delate_family = frappe.db.delete("Primary Member", {
                        "name": beneficiary.contact_number})   
        return delate_family