import frappe


class family:
    def create(beneficiary):
        family_doc = frappe.new_doc("Primary Member")
        family_doc.name_of_head_of_family = beneficiary.name
        family_doc.name_of_parents = beneficiary.name_of_the_beneficiary
        family_doc.phone_no = beneficiary.contact_number
        print("family")

    def update(beneficiary):
        print("jj")

    def delete(beneficiary):
        print("kk")

    