(async function () {
  const data = await fetch("./src/data.json")
  const res = await data.json()
  let isEdit = false;
  let employees = res;
  let selectedEmployeeId = employees[0].id;
  let selectedEmployee = employees[0];

  const employeeList = document.querySelector(".employees__names--list");
  const employeeInfo = document.querySelector(".employees__single--info");

  // Add Employee - START
  const createEmployee = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee_create");
  const editEmployee = document.querySelector(".edit-icon");

  editEmployee.addEventListener('click',()=>{
    addEmployeeModal.style.display = "flex";
    isEdit = true;
    const employeeForm  = addEmployeeForm.children;
    Array.from(employeeForm).forEach((emp)=>{
     if(emp.tagName == 'DIV'){
        const empChild = emp.children;
        Array.from(empChild).forEach((emp)=>{
          if(emp.name == 'firstName'){
            emp.value = selectedEmployee.firstName;
          }
          else if(emp.name == 'lastName'){
            emp.value = selectedEmployee.lastName;
          }
        })
     } else if(emp.tagName == 'SPAN'){
          emp.innerHTML = 'Edit an Employee'
     } else {
      if(emp.name === 'imageUrl'){
        emp.value = selectedEmployee.imageUrl;
      }else if(emp.name === 'email'){
        emp.value = selectedEmployee.email;
      }else if(emp.name === 'contactNumber'){
        emp.value = selectedEmployee.contactNumber;
      }else if(emp.name === 'salary'){
        emp.value = selectedEmployee.salary;
      }else if(emp.name === 'address'){
        emp.value = selectedEmployee.address;
      }else if(emp.name === 'dob'){
        emp.value = selectedEmployee.dob;
      }
     }
    })
  })
  
  createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
    addEmployeeForm.firstElementChild.innerHTML = 'Add an Employee';
    addEmployeeForm.reset();
  });

  addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.className === "addEmployee") {
      addEmployeeModal.style.display = "none";
    }
  });

  // Set Employee age to be entered minimum 18 years
  const dobInput = document.querySelector(".addEmployee_create--dob");
  console.log(new Date().getFullYear(),'today ')
  console.log(new Date().toISOString().slice(5, 10),'dob')
  dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`   //( 2023-18 = '2005' ) - ( 2023-01-27 --> '01-27' )
  console.log(dobInput.max)                                                                     // dobInput.max = 2005-01-27 

  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
      const formData = new FormData(addEmployeeForm);
      console.log(formData.entries)
      const values = [...formData.entries()];
      console.log(values)
      let empData = {};
      values.forEach((val) => {
        empData[val[0]] = val[1];
      });
      empData.age =
        new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
      empData.imageUrl =
        empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";
        if(!isEdit){
      empData.id = employees[employees.length - 1].id + 1;
      employees.push(empData);
        }
        else {
          empData.id = selectedEmployeeId;
            selectedEmployee = empData;
          }  
      renderEmployees();
      renderSingleEmployee();
      isEdit = false;
      addEmployeeForm.reset();
      addEmployeeModal.style.display = "none";
  });
  // Add Employee - END

  employeeList.addEventListener("click", (e) => {
    // Select Employee Logic - START
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = e.target.id;
      renderEmployees();
      renderSingleEmployee();
    }
    // Select Employee Logic - END

    // Employee Delete Logic - START
    if (e.target.tagName === "I") {
      debugger
      console.log(e.target)
      employees = employees.filter(
        (emp) => String(emp.id) !== e.target.parentNode.id
      );
      if (String(selectedEmployeeId) === e.target.parentNode.id) {
        selectedEmployeeId = employees[0]?.id || -1;
        selectedEmployee = employees[0] || {};
        renderSingleEmployee();
      }
      renderEmployees();
    }
    // Employee Delete Logic - END
  });

  // Render All Employees Logic - START
  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employees.forEach((emp,i) => {
      const employee = document.createElement("span");
      employee.classList.add("employees__names--item");
      if (parseInt(selectedEmployeeId, 10) === emp.id) {
        employee.classList.add("selected");
        if(isEdit){
          emp = selectedEmployee;
          employees[i]=selectedEmployee;
        }else
        selectedEmployee = emp;
      }
      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">❌</i>`;
      employeeList.append(employee);
    });
  };
  // Render All Employees Logic - END

  // Render Single Employee Logic - START
  const renderSingleEmployee = () => {
    // Employee Delete Logic - START
    if (selectedEmployeeId === -1) {
      employeeInfo.innerHTML = "";
      return;
    }
    // Employee Delete Logic - END

    employeeInfo.innerHTML = `
      <img src="${selectedEmployee.imageUrl}" />
      <span class="employees__single--heading">
      ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
      </span>
      <span>${selectedEmployee.address}</span>
      <span>${selectedEmployee.email}</span>
      <span>Mobile - ${selectedEmployee.contactNumber}</span>
      <span>DOB - ${selectedEmployee.dob}</span>
    `;
  };
  // Render Single Employee Logic - END

  renderEmployees();
  if (selectedEmployee) renderSingleEmployee();
})()