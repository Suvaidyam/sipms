// Copyright (c) 2023, suvaidyam and contributors
// For license information, please see license.txt

//  COMMON FUNCTION FOR DEFULT FILTER 
function defult_filter(field_name, filter_on , frm){
    frm.fields_dict[field_name].get_query = function (doc) {
        return {
          filters: {
            [filter_on]: `please select Current ${filter_on}`,
          },
        };
      }
};
///// COMMON FUNCTON FOR FILTER OF LINK FIELD
function apply_filter(field_name, filter_on , frm , filter_value){
    frm.fields_dict[field_name].get_query = function (doc) {
        return {
          filters: {
            [filter_on]: filter_value,
          },
          page_length: 1000
        };
      }
};
// ///// Hide Advance search option in Link Fields
function hide_advance_search(frm ,list){
    for(item of list){
        frm.set_df_property(item, 'only_select', true);
    }
}


frappe.ui.form.on("Beneficiary Profiling", {
    /////////////////  CALL ON SAVE OF DOC OR UPDATE OF DOC ////////////////////////////////
    before_save: function(frm){

    },
	refresh(frm) {
        // set  defult date of visit 
        if(frm.doc.__islocal){
            frm.set_value('date_of_visit', frappe.datetime.get_today());
        }
        // Hide Advance search options
        hide_advance_search(frm, ["state","district", "ward", "state_of_origin" ,
        "district_of_origin", "block" , "gender", "caste_category","religion", "education",
        "current_occupation","marital_status","social_vulnerable_category","pwd_category","family"])

        // Increase Defult Limit of link field 
        frm.set_query("state", () => { return { page_length: 1000 };});
        frm.set_query("district", () => { return { page_length: 1000 };});
        frm.set_query("ward", () => { return { page_length: 1000 };});
        frm.set_query("state_of_origin", () => { return { page_length: 1000 };});
        frm.set_query("district_of_origin", () => { return { page_length: 1000 };});
        frm.set_query("block", () => { return { page_length: 1000 };});

        // Apply defult filter in doctype
        defult_filter('district', "State" , frm);
        defult_filter('ward', "District" , frm)
        defult_filter('district_of_origin', "State" , frm)
        defult_filter('block', "District" , frm)
	},
    state:function(frm){
        apply_filter("district","State", frm , frm.doc.state)
    },
    district:function(frm){
        apply_filter("ward","District", frm , frm.doc.district)
    },
    state_of_origin:function(frm){
        console.log(frm.doc.state)
        apply_filter("district_of_origin","State", frm , frm.doc.state_of_origin)
    },
    district_of_origin:function(frm){
        apply_filter("block","District", frm , frm.doc.district_of_origin)
    }

});
