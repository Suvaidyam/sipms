# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class BeneficiaryProfiling(Document):
	def after_insert(self):
		if(self.has_anyone_from_your_family_visisted_before == "No"):
			print('')
