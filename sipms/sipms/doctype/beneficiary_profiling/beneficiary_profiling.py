# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from sipms.services.family import family


class BeneficiaryProfiling(Document):
	def after_insert(self):
		beneficiary = frappe.get_doc("Beneficiary Profiling" , self.name)
		print(self.has_anyone_from_your_family_visisted_before)
		if(self.has_anyone_from_your_family_visisted_before == "No"):
			family.create(self)
			beneficiary.family = family.create
			beneficiary.save()

	def on_update(self):
		beneficiary = frappe.get_doc("Beneficiary Profiling" , self.name)
		if(self.has_anyone_from_your_family_visisted_before == "No"):
			family.update(self)
			beneficiary.family = family.update
			# beneficiary.save()