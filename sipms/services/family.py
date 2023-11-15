import frappe


class family:
    def create(beneficiary):
        family_doc = frappe.new_doc("Family")
        family_doc.name_of_head_of_family = beneficiary.name
        family_doc.name_of_parents = beneficiary.name_of_the_beneficiary
        family_doc.phone_no = beneficiary.contact_number
        family_doc.insert()
        return family_doc


    def update(beneficiary):
        family_doc_name = frappe.get_list("Family",
        filters={'name_of_head_of_family': beneficiary.name},
        fields=["name"])
        if(family_doc_name):
            family_doc = frappe.get_doc("Family", family_doc_name[0].name)
            family_doc.name_of_parents = beneficiary.name_of_the_beneficiary
            family_doc.phone_no = beneficiary.contact_number
            family_doc.save()
            return family_doc
        else:
            family_doc = frappe.new_doc("Family")
            family_doc.name_of_head_of_family = beneficiary.name
            family_doc.name_of_parents = beneficiary.name_of_the_beneficiary
            family_doc.phone_no = beneficiary.contact_number
            family_doc.insert()
			# update current beneficery to family
            frappe.msgprint("New Beneficary Update As a Head of Family")
            return family_doc
        

    def delete(beneficiary):
        print("kk")

    