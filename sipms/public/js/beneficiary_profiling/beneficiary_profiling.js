console.log("second files render")
// order list in select fields
const get_ordered_list = async (doctype, optionsToSort) => {
    let list = await callAPI({
      method: 'frappe.desk.search.search_link',
      freeze: true,
      args: {
        doctype: doctype,
        page_length: 1000,
        txt: ''
      },
      freeze_message: __("Getting list ..."),
    })
    if (optionsToSort) {
      let reOrderedList = [];
      optionsToSort?.forEach(async (option) => {
        const requiredOption = await list?.find(item => item.value === option);
        reOrderedList.push(requiredOption);
      });
      const exceptionList = await list?.filter(item => !optionsToSort.some(item2 => item.value === item2));
      exceptionList?.forEach(async (option) => {
        reOrderedList = [...reOrderedList, option];
      })
      list = reOrderedList;
      return list;
      // const otherOption = list.find(item => item.value === 'Others');
      // if (otherOption) {
      //   list = list.filter(item => item.value !== 'Others');
      //   list.push(otherOption);
      // }
    }
    return list
  
}
// get scheme lists
const get_scheme_list = async (frm) => {
    let list = await callAPI({
      method: 'sipms.api.execute',
      freeze: true,
      args: {
        name: frm.doc.name
      },
      freeze_message: __("Getting schemes..."),
    })
    scheme_list = list.sort((a, b) => b.matching_rules_per - a.matching_rules_per);
    return scheme_list
  }
  const get_occupation_category = async (frm) => {
    let list = await callAPI({
      method: 'frappe.client.get',
      freeze: true,
      args: {
        doctype: 'Occupation',
        name: frm.doc.current_occupation
      },
      freeze_message: __("Getting schemes..."),
    })
    return list;
  }
  
  const get_document = async (filter, fields) => {
    return await frappe.call({
      method: 'frappe.client.get_value',
      args: {
        'doctype': 'Beneficiary Profiling',
        'filters': filter,
        'fieldname': fields
      },
      callback: function (response) {
        // Handle the response
        if (!response.exc) {
          var doc = response.message;
          return doc;
        } else {
          console.error('Error fetching document:', response.exc);
        }
      }
    });
  
  }
  const addTableFilter = (datatable, elements = [], rows = []) => {
    document.addEventListener('keyup', function (event) {
      if (elements.includes(event.target.id)) {
        let filters = []
        for (el of elements) {
          let val = document.getElementById(el)?.value;
          if (val) {
            filters.push([el, val])
          }
        }
        if (filters.length) {
          datatable.refresh(rows.filter(row => !filters.map(e => (row[e[0]]?.toString()?.toLowerCase()?.indexOf(e[1]?.toLowerCase()) > -1)).includes(false)))
        } else {
          datatable.refresh(rows)
        }
      }
    });
  }